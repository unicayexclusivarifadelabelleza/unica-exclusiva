import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'

    const raffles = await db.raffle.findMany({
      where: { status },
      include: {
        prizes: true,
        _count: {
          select: {
            tickets: {
              where: { status: 'sold' }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ raffles })
  } catch (error) {
    console.error('Error fetching raffles:', error)
    return NextResponse.json(
      { error: 'Error al obtener rifas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, ticketPrice, maxTickets } = body

    if (!title || !ticketPrice || !maxTickets) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Create raffle
    const raffle = await db.raffle.create({
      data: {
        title,
        description: description || null,
        ticketPrice,
        maxTickets,
        status: 'active'
      }
    })

    return NextResponse.json({ raffle })
  } catch (error) {
    console.error('Error creating raffle:', error)
    return NextResponse.json(
      { error: 'Error al crear rifa' },
      { status: 500 }
    )
  }
}
