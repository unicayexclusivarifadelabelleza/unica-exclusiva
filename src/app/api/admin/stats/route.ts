import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Total tickets sold
    const totalTicketsSold = await db.ticket.count({
      where: { status: 'sold' }
    })

    // Total revenue from completed payments
    const completedPayments = await db.payment.findMany({
      where: { status: 'completed' }
    })

    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0)

    // Pending payments
    const pendingPaymentsCount = await db.payment.count({
      where: { status: 'pending' }
    })

    // Total unique customers
    const totalCustomers = await db.user.count()

    // Get tickets sold by price
    const ticketsSold = await db.ticket.findMany({
      where: { status: 'sold' },
      include: {
        raffle: true
      }
    })

    // Group by raffle price
    const ticketsByPrice: Record<number, number> = {
      1000: 0,
      2000: 0,
      3000: 0
    }

    ticketsSold.forEach(ticket => {
      const price = ticket.raffle.ticketPrice
      if (ticketsByPrice[price] !== undefined) {
        ticketsByPrice[price]++
      }
    })

    const ticketsByType = [
      { price: 1000, sold: ticketsByPrice[1000] },
      { price: 2000, sold: ticketsByPrice[2000] },
      { price: 3000, sold: ticketsByPrice[3000] }
    ]

    return NextResponse.json({
      totalTicketsSold,
      totalRevenue,
      pendingPayments: pendingPaymentsCount,
      completedPayments: completedPayments.length,
      totalCustomers,
      ticketsByPrice: ticketsByType
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
