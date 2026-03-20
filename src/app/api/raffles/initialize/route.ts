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

    // Get raffle
    const raffle = await db.raffle.findUnique({
      where: { id: raffleId }
    })

    if (!raffle) {
      return NextResponse.json(
        { error: 'La rifa no existe' },
        { status: 404 }
      )
    }

    // Check if tickets already exist
    const existingTickets = await db.ticket.findMany({
      where: { raffleId }
    })

    if (existingTickets.length > 0) {
      return NextResponse.json(
        { error: 'Los boletos ya existen para esta rifa' },
        { status: 400 }
      )
    }

    // Create tickets (1 to maxTickets)
    const tickets = []
    for (let i = 1; i <= raffle.maxTickets; i++) {
      tickets.push({
        raffleId,
        number: i,
        status: 'available'
      })
    }

    await db.ticket.createMany({
      data: tickets
    })

    return NextResponse.json({
      success: true,
      ticketsCreated: tickets.length
    })
  } catch (error) {
    console.error('Error initializing raffle tickets:', error)
    return NextResponse.json(
      { error: 'Error al inicializar boletos' },
      { status: 500 }
    )
  }
}
