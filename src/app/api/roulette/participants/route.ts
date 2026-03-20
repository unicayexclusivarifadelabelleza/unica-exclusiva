import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get active raffles
    const raffles = await db.raffle.findMany({
      where: {
        status: 'active'
      },
      include: {
        tickets: {
          include: {
            user: true
          },
          where: {
            status: 'sold'
          }
        }
      }
    })

    // Collect all sold tickets with their buyers
    const allParticipants: Array<{
      id: string
      name: string
      number: number
    }> = []

    raffles.forEach(raffle => {
      raffle.tickets.forEach(ticket => {
        if (ticket.status === 'sold' && ticket.user) {
          allParticipants.push({
            id: ticket.id,
            name: ticket.user.name || 'Comprador',
            number: ticket.number
          })
        }
      })
    })

    return NextResponse.json({
      success: true,
      participants: allParticipants,
      totalParticipants: allParticipants.length,
      raffles: raffles.length
    })
  } catch (error) {
    console.error('Error fetching roulette participants:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al obtener participantes',
      participants: []
    }, { status: 500 })
  }
}
