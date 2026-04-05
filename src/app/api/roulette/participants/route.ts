import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get ticket price tier from query params
    const searchParams = request.nextUrl.searchParams
    const tier = searchParams.get('tier') // '1000', '2000', '3000', or null for all

    // Get active raffles
    let rafflesQuery: any = {
      where: {
        status: 'active'
      },
      include: {
        tickets: {
          include: {
            user: true,
            payment: true
          },
          where: {
            status: 'sold' // Only show SOLD tickets (not just reserved)
          }
        }
      }
    }

    // Filter by tier if specified
    if (tier && ['1000', '2000', '3000'].includes(tier)) {
      rafflesQuery.where.ticketPrice = parseInt(tier)
    }

    const raffles = await db.raffle.findMany(rafflesQuery)

    // Collect all sold tickets with their buyers
    // AND verify that payment is completed
    const allParticipants: Array<{
      id: string
      name: string
      number: number
      ticketPrice: number
    }> = []

    raffles.forEach(raffle => {
      raffle.tickets.forEach(ticket => {
        // Only add to participants if:
        // 1. Ticket status is 'sold'
        // 2. Payment status is 'completed'
        if (ticket.status === 'sold' && ticket.payment?.status === 'completed' && ticket.user) {
          allParticipants.push({
            id: ticket.id,
            name: ticket.user.name || 'Comprador',
            number: ticket.number,
            ticketPrice: raffle.ticketPrice
          })
        }
      })
    })

    // Get counts by tier
    const bronceCount = allParticipants.filter(p => p.ticketPrice === 1000).length
    const plataCount = allParticipants.filter(p => p.ticketPrice === 2000).length
    const oroCount = allParticipants.filter(p => p.ticketPrice === 3000).length

    // Log for debugging
    console.log(`Total raffles: ${raffles.length}`)
    console.log(`Total sold tickets: ${raffles.reduce((sum, r) => sum + r.tickets.length, 0)}`)
    console.log(`Participants by tier - Bronce: ${bronceCount}, Plata: ${plataCount}, Oro: ${oroCount}`)
    console.log(`Current filter: ${tier || 'all'}`)

    return NextResponse.json({
      success: true,
      participants: allParticipants,
      totalParticipants: allParticipants.length,
      raffles: raffles.length,
      countsByTier: {
        bronce: bronceCount,
        plata: plataCount,
        oro: oroCount
      },
      currentTier: tier || 'all',
      message: tier
        ? `Mostrando ${allParticipants.length} participante(s) de nivel ${tier === '1000' ? 'Bronce' : tier === '2000' ? 'Plata' : 'Oro'} con pagos completados`
        : allParticipants.length === 0
        ? 'No hay participantes aún. Solo aparecerán personas que hayan completado el pago.'
        : `${allParticipants.length} participante(s) con pagos completados (todos los niveles)`
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
