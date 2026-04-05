import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get the active raffle
    const activeRaffle = await db.raffle.findFirst({
      where: {
        status: 'active'
      },
      include: {
        prizes: true
      }
    })

    if (!activeRaffle) {
      return NextResponse.json({ prizes: [] })
    }

    // Group prizes by ticket price tier
    const prizesByTier = {
      bronce: activeRaffle.prizes.filter(p => activeRaffle.ticketPrice === 1000),
      plata: activeRaffle.prizes.filter(p => activeRaffle.ticketPrice === 2000),
      oro: activeRaffle.prizes.filter(p => activeRaffle.ticketPrice === 3000)
    }

    return NextResponse.json({
      raffle: activeRaffle,
      prizes: activeRaffle.prizes,
      prizesByTier
    })
  } catch (error) {
    console.error('Error fetching prizes:', error)
    return NextResponse.json(
      { error: 'Error al obtener los premios' },
      { status: 500 }
    )
  }
}
