import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const raffleId = searchParams.get('raffleId')

    if (!raffleId) {
      return NextResponse.json(
        { error: 'El ID de la rifa es requerido' },
        { status: 400 }
      )
    }

    // Get available tickets for the raffle
    const availableTickets = await db.ticket.findMany({
      where: {
        raffleId,
        drawId: null,
        status: 'available'
      },
      orderBy: {
        number: 'asc'
      }
    })

    return NextResponse.json({ 
      tickets: availableTickets,
      count: availableTickets.length
    })
  } catch (error) {
    console.error('Error fetching available tickets:', error)
    return NextResponse.json(
      { error: 'Error al obtener boletos disponibles' },
      { status: 500 }
    )
  }
}
