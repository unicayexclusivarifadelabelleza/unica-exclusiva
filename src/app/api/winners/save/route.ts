import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, raffleId, tier } = body

    if (!ticketId || !raffleId) {
      return NextResponse.json(
        { error: 'ticketId y raffleId son requeridos' },
        { status: 400 }
      )
    }

    // Get the ticket with user and raffle info
    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: true,
        raffle: true
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Boleto no encontrado' },
        { status: 404 }
      )
    }

    // Check if this ticket is already a winner
    const existingWinner = await db.winner.findFirst({
      where: { ticketId }
    })

    if (existingWinner) {
      return NextResponse.json({
        success: true,
        message: 'Este boleto ya está registrado como ganador',
        winner: existingWinner
      })
    }

    // Find a prize from the raffle (assign first available prize)
    const prize = await db.prize.findFirst({
      where: { raffleId },
      orderBy: { value: 'asc' } // Start with lowest value prize
    })

    if (!prize) {
      return NextResponse.json(
        { error: 'No hay premios disponibles en esta rifa' },
        { status: 400 }
      )
    }

    // Create or get a draw
    let draw = await db.draw.findFirst({
      where: {
        raffleId,
        status: 'pending'
      }
    })

    if (!draw) {
      draw = await db.draw.create({
        data: {
          raffleId,
          drawNumber: 1,
          totalTickets: 1,
          winnersCount: 1,
          status: 'pending'
        }
      })
    }

    // Create winner record
    const winner = await db.winner.create({
      data: {
        drawId: draw.id,
        prizeId: prize.id,
        ticketId: ticketId,
        userId: ticket.userId!
      }
    })

    // Update ticket status to winner
    await db.ticket.update({
      where: { id: ticketId },
      data: { status: 'winner' }
    })

    return NextResponse.json({
      success: true,
      message: `Ganador registrado: ${ticket.user.name}`,
      winner: {
        id: winner.id,
        userName: ticket.user.name,
        userPhone: ticket.user.phone,
        ticketNumber: ticket.number,
        prizeName: prize.name,
        prizeValue: prize.value,
        tier: tier || 'desconocido',
        drawDate: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error saving winner:', error)
    return NextResponse.json(
      { error: 'Error al guardar ganador' },
      { status: 500 }
    )
  }
}

// GET - Fetch all winners
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const raffleId = searchParams.get('raffleId')

    const winners = await db.winner.findMany({
      include: {
        ticket: {
          include: {
            user: true
          }
        },
        prize: true,
        draw: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter by raffle if specified
    const filteredWinners = raffleId
      ? winners.filter(w => w.draw?.raffleId === raffleId)
      : winners

    return NextResponse.json({
      success: true,
      winners: filteredWinners,
      total: filteredWinners.length
    })

  } catch (error) {
    console.error('Error fetching winners:', error)
    return NextResponse.json(
      { error: 'Error al obtener ganadores', winners: [] },
      { status: 500 }
    )
  }
}
