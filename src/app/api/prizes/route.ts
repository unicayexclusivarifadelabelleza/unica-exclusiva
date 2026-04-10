import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all active raffles
    const activeRaffles = await db.raffle.findMany({
      where: {
        status: 'active'
      },
      include: {
        prizes: true
      }
    })

    if (!activeRaffles || activeRaffles.length === 0) {
      return NextResponse.json({ prizes: [], raffles: [] })
    }

    // Get all prizes from all active raffles
    const allPrizes = activeRaffles.flatMap(raffle => raffle.prizes || [])

    // Group prizes by ticket price tier
    const prizesByTier = {
      bronce: allPrizes.filter(p => p.value && p.value <= 15000),
      plata: allPrizes.filter(p => p.value && p.value > 15000 && p.value <= 25000),
      oro: allPrizes.filter(p => p.value && p.value > 25000)
    }

    return NextResponse.json({
      prizes: allPrizes,
      prizesByTier,
      raffles: activeRaffles
    })
  } catch (error) {
    console.error('Error fetching prizes:', error)
    return NextResponse.json(
      { error: 'Error al obtener los premios', prizes: [], raffles: [] },
      { status: 500 }
    )
  }
}
