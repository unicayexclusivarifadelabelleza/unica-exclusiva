import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const raffleId = searchParams.get('raffleId')
    const limit = parseInt(searchParams.get('limit') || '10')

    const winners = await db.winner.findMany({
      where: raffleId ? { draw: { raffleId } } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        prize: true,
        ticket: true,
        draw: {
          include: {
            raffle: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json({ winners })
  } catch (error) {
    console.error('Error fetching winners:', error)
    return NextResponse.json(
      { error: 'Error al obtener ganadores' },
      { status: 500 }
    )
  }
}
