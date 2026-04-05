import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all payments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // Filter by status if provided

    const payments = await db.payment.findMany({
      include: {
        user: true,
        tickets: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter by status if specified
    const filteredPayments = status
      ? payments.filter(p => p.status === status)
      : payments

    return NextResponse.json({
      success: true,
      payments: filteredPayments,
      total: filteredPayments.length,
      stats: {
        pending: payments.filter(p => p.status === 'pending').length,
        completed: payments.filter(p => p.status === 'completed').length,
        failed: payments.filter(p => p.status === 'failed').length
      }
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Error al obtener pagos', payments: [] },
      { status: 500 }
    )
  }
}

// PATCH - Update payment status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, status } = body

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'paymentId y status son requeridos' },
        { status: 400 }
      )
    }

    if (!['completed', 'failed', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido. Debe ser completed, failed o pending' },
        { status: 400 }
      )
    }

    const updatedPayment = await db.payment.update({
      where: { id: paymentId },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      payment: updatedPayment
    })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el estado del pago' },
      { status: 500 }
    )
  }
}
