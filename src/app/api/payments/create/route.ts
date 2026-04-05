import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ticketIds, amount } = body

    if (!userId || !ticketIds || !amount) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId,
        ticketId: Array.isArray(ticketIds) ? ticketIds[0] : ticketIds,
        amount,
        status: 'pending',
        paymentMethod: 'mercadopago'
      }
    })

    // TODO: Integrate with Mercado Pago API
    // For now, return a mock preference
    const mockPreferenceId = `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Update payment with preference ID
    await db.payment.update({
      where: { id: payment.id },
      data: { preferenceId: mockPreferenceId }
    })

    return NextResponse.json({
      paymentId: payment.id,
      preferenceId: mockPreferenceId,
      initPoint: `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${mockPreferenceId}`,
      amount
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Error al crear pago' },
      { status: 500 }
    )
  }
}
