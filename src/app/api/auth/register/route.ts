import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone } = body

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      )
    }

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name: name || null,
        phone: phone || null
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone
      }
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    )
  }
}
