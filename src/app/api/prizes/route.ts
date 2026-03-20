import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { raffleId, name, value, imageUrl } = body

    if (!raffleId || !name || !value) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Create prize
    const prize = await db.prize.create({
      data: {
        raffleId,
        name,
        value: parseInt(value),
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json({ prize })
  } catch (error) {
    console.error('Error creating prize:', error)
    return NextResponse.json(
      { error: 'Error al crear premio' },
      { status: 500 }
    )
  }
}
