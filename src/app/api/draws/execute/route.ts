import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { raffleId } = body

    if (!raffleId) {
      return NextResponse.json(
        { error: 'El ID de la rifa es requerido' },
        { status: 400 }
      )
    }

    // Find raffle
    const raffle = await db.raffle.findUnique({
      where: { id: raffleId },
      include: {
        prizes: {
          orderBy: { value: 'desc' }
        },
        tickets: {
          where: { 
            status: 'sold',
            drawId: null
          }
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

    const soldTickets = raffle.tickets
    const totalSold = soldTickets.length

    // Calculate number of draws needed
    // Every 50 tickets = 1 draw with 3 winners
    const numberOfDraws = Math.floor(totalSold / 50)
    const ticketsForCurrentDraw = totalSold % 50

    if (numberOfDraws === 0 && ticketsForCurrentDraw < 50) {
      return NextResponse.json(
        { error: 'No hay suficientes boletos vendidos para realizar un sorteo' },
        { status: 400 }
      )
    }

    // Get or create the current draw
    const existingDraws = await db.draw.findMany({
      where: { raffleId },
      orderBy: { drawNumber: 'desc' },
      take: 1
    })

    const nextDrawNumber = existingDraws.length > 0 ? existingDraws[0].drawNumber + 1 : 1

    // Determine how many tickets to include in this draw
    const ticketsToDraw = numberOfDraws > 0 ? 50 : ticketsForCurrentDraw
    
    // Calculate winners count: 3 winners per 50 tickets
    const winnersCount = Math.ceil(ticketsToDraw / 17) // Approx 3 winners per 50

    // Create draw
    const draw = await db.draw.create({
      data: {
        raffleId,
        drawNumber: nextDrawNumber,
        totalTickets: ticketsToDraw,
        winnersCount: Math.min(winnersCount, 3),
        status: 'completed',
        completedAt: new Date()
      }
    })

    // Select tickets for this draw
    const ticketsForDraw = soldTickets.slice(0, ticketsToDraw)

    // Assign tickets to draw
    await db.ticket.updateMany({
      where: {
        id: { in: ticketsForDraw.map(t => t.id) }
      },
      data: { drawId: draw.id }
    })

    // Shuffle tickets and select winners
    const shuffledTickets = [...ticketsForDraw].sort(() => Math.random() - 0.5)
    const winningTickets = shuffledTickets.slice(0, Math.min(winnersCount, 3, shuffledTickets.length))

    // Assign prizes to winners
    const winners = []
    for (let i = 0; i < winningTickets.length; i++) {
      const winningTicket = winningTickets[i]
      const prize = raffle.prizes[i % raffle.prizes.length] // Cycle through prizes if needed

      if (winningTicket.userId && prize) {
        const winner = await db.winner.create({
          data: {
            drawId: draw.id,
            prizeId: prize.id,
            ticketId: winningTicket.id,
            userId: winningTicket.userId
          }
        })
        winners.push(winner)

        // Update ticket status
        await db.ticket.update({
          where: { id: winningTicket.id },
          data: { status: 'winner' }
        })
      }
    }

    // Check if raffle should be completed
    const remainingTickets = soldTickets.slice(ticketsToDraw)
    if (remainingTickets.length < 50 && numberOfDraws === 0) {
      await db.raffle.update({
        where: { id: raffleId },
        data: { status: 'completed' }
      })
    }

    return NextResponse.json({
      draw: {
        id: draw.id,
        drawNumber: draw.drawNumber,
        totalTickets: draw.totalTickets,
        winnersCount: winners.length
      },
      winners: winners.map(w => ({
        userId: w.userId,
        ticketId: w.ticketId
      }))
    })
  } catch (error) {
    console.error('Error executing draw:', error)
    return NextResponse.json(
      { error: 'Error al ejecutar sorteo' },
      { status: 500 }
    )
  }
}
