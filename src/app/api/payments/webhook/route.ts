import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Mercado Pago webhook structure
    const { type, data } = body

    if (type === 'payment') {
      const paymentId = data.id

      // TODO: Verify payment with Mercado Pago API
      // For now, we'll mock the payment verification
      
      // Find payment in database by preference ID or transaction ID
      const payment = await db.payment.findFirst({
        where: {
          OR: [
            { transactionId: String(paymentId) },
            { preferenceId: String(paymentId) }
          ]
        },
        include: {
          ticket: true
        }
      })

      if (payment) {
        // Update payment status as completed
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            transactionId: String(paymentId)
          }
        })

        console.log(`Payment ${paymentId} completed successfully`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Error al procesar webhook' },
      { status: 500 }
    )
  }
}
