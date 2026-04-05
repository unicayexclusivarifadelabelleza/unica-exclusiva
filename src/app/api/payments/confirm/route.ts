import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId } = body

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId es requerido' },
        { status: 400 }
      )
    }

    // Verify payment exists
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        tickets: true,
        user: true
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pago no encontrado' },
        { status: 404 }
      )
    }

    if (payment.status === 'completed') {
      return NextResponse.json({
        success: true,
        message: 'El pago ya fue confirmado anteriormente'
      })
    }

    // Update payment status to completed
    await db.payment.update({
      where: { id: paymentId },
      data: {
        status: 'completed',
        updatedAt: new Date()
      }
    })

    // Update tickets from 'reserved' to 'sold' (only tickets associated with this payment)
    const tickets = await db.ticket.updateMany({
      where: {
        paymentId: paymentId,
        status: 'reserved'
      },
      data: {
        status: 'sold',
        soldAt: new Date(),
        expiresAt: null, // Clear expiration since payment is complete
        updatedAt: new Date()
      }
    })

    if (tickets.count === 0) {
      console.warn('No tickets were updated - they may have already been sold or expired')
    }

    return NextResponse.json({
      success: true,
      message: `¡Pago confirmado! ${tickets.count} boleto(s) vendido(s) para ${payment.user.name}`,
      ticketsUpdated: tickets.count,
      userName: payment.user.name
    })

  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Error al confirmar el pago' },
      { status: 500 }
    )
  }
}

// GET endpoint to check payment status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId es requerido' },
        { status: 400 }
      )
    }

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        tickets: true,
        user: true
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pago no encontrado' },
        { status: 404 }
      )
    }

    // Check if tickets have expired
    const expiredTickets = await db.ticket.count({
      where: {
        paymentId: paymentId,
        status: 'reserved',
        expiresAt: {
          lt: new Date()
        }
      }
    })

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        user: {
          name: payment.user.name,
          phone: payment.user.phone
        }
      },
      tickets: {
        total: payment.tickets.length,
        sold: payment.tickets.filter(t => t.status === 'sold').length,
        reserved: payment.tickets.filter(t => t.status === 'reserved').length,
        expired: expiredTickets
      }
    })

  } catch (error) {
    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { error: 'Error al verificar el estado del pago' },
      { status: 500 }
    )
  }
}
