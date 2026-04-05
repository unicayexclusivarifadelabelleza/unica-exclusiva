import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const payments = await db.payment.findMany({
      include: {
        user: true,
        tickets: {
          include: {
            raffle: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const purchases = payments.map(payment => {
      const metadata = payment.metadata ? JSON.parse(payment.metadata) : {}
      
      return {
        id: payment.id,
        paymentId: payment.id,
        userName: payment.user?.name || 'Desconocido',
        userPhone: payment.user?.phone || metadata.customerPhone,
        userEmail: metadata.customerEmail || payment.user?.email,
        ticketNumbers: payment.tickets.map(t => t.number),
        ticketPrice: metadata.ticketPrice || payment.tickets[0]?.raffle?.ticketPrice || 1000,
        total: payment.amount,
        ticketType: metadata.ticketType || 'Bronce',
        status: payment.status,
        createdAt: payment.createdAt,
        soldAt: payment.tickets[0]?.soldAt
      }
    })

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { error: 'Error al obtener compras' },
      { status: 500 }
    )
  }
}
