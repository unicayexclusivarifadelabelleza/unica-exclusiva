import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const raffles = await db.raffle.findMany({
      where: {
        ticketPrice: { in: [1000, 2000, 3000] }
      },
      include: {
        tickets: {
          include: {
            user: true
          }
        }
      }
    })

    const ticketGrids = raffles.map(raffle => {
      const label = raffle.ticketPrice === 1000 ? 'Bronce' : raffle.ticketPrice === 2000 ? 'Plata' : 'Oro'
      
      // Create array of all 100 tickets
      const tickets = Array.from({ length: 100 }, (_, i) => {
        const ticketNumber = i + 1
        const ticket = raffle.tickets.find(t => t.number === ticketNumber)
        
        if (ticket && ticket.status === 'sold' && ticket.user) {
          return {
            number: ticketNumber,
            status: 'sold' as const,
            userName: ticket.user.name,
            userPhone: ticket.user.phone
          }
        }
        
        return {
          number: ticketNumber,
          status: (ticket?.status || 'available') as 'available' | 'sold'
        }
      })

      return {
        price: raffle.ticketPrice,
        label,
        tickets
      }
    })

    return NextResponse.json(ticketGrids)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Error al obtener boletos' },
      { status: 500 }
    )
  }
}
