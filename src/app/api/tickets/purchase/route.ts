import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { raffleId, userId, ticketNumbers } = body

    if (!raffleId || !userId || !ticketNumbers || !Array.isArray(ticketNumbers)) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Check if raffle exists and is active
    const raffle = await db.raffle.findUnique({
      where: { id: raffleId },
      include: {
        tickets: {
          where: { status: 'sold' }
        }
      }
    })

    if (!raffle) {
      return NextResponse.json(
        { error: 'La rifa no existe' },
        { status: 404 }
      )
    }

    if (raffle.status !== 'active') {
      return NextResponse.json(
        { error: 'La rifa no está activa' },
        { status: 400 }
      )
    }

    // Check if tickets are available
    const existingTickets = await db.ticket.findMany({
      where: {
        raffleId,
        number: { in: ticketNumbers },
        drawId: null,
        status: { not: 'sold' }
      }
    })

    if (existingTickets.length !== ticketNumbers.length) {
      return NextResponse.json(
        { error: 'Algunos boletos no están disponibles' },
        { status: 400 }
      )
    }

    // Update tickets as sold
    const tickets = await db.ticket.updateMany({
      where: {
        id: { in: existingTickets.map(t => t.id) }
      },
      data: {
        status: 'sold',
        userId
      }
    })

    return NextResponse.json({
      success: true,
      ticketsPurchased: tickets.count
    })
  } catch (error) {
    console.error('Error purchasing tickets:', error)
    return NextResponse.json(
      { error: 'Error al comprar boletos' },
      { status: 500 }
    )
  }
}
