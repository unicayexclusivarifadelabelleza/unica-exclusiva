import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Find all expired reserved tickets
    const expiredTickets = await db.ticket.findMany({
      where: {
        status: 'reserved',
        expiresAt: {
          lt: new Date() // Expired
        }
      },
      include: {
        payment: true,
        user: true
      }
    })

    if (expiredTickets.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay tickets expirados para liberar',
        releasedCount: 0
      })
    }

    // Update expired tickets back to 'available'
    const result = await db.ticket.updateMany({
      where: {
        id: { in: expiredTickets.map(t => t.id) },
        status: 'reserved',
        expiresAt: {
          lt: new Date()
        }
      },
      data: {
        status: 'available',
        userId: null,
        paymentId: null,
        reservedAt: null,
        expiresAt: null,
        updatedAt: new Date()
      }
    })

    // Mark related payments as failed
    const paymentIds = [...new Set(expiredTickets.map(t => t.paymentId).filter(Boolean))]
    if (paymentIds.length > 0) {
      await db.payment.updateMany({
        where: {
          id: { in: paymentIds as string[] },
          status: 'pending'
        },
        data: {
          status: 'failed',
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `Se liberaron ${result.count} ticket(s) expirado(s)`,
      releasedCount: result.count,
      failedPayments: paymentIds.length,
      details: expiredTickets.map(t => ({
        ticketNumber: t.number,
        userId: t.userId,
        userName: t.user?.name,
        expiredAt: t.expiresAt
      }))
    })

  } catch (error) {
    console.error('Error releasing expired tickets:', error)
    return NextResponse.json(
      { error: 'Error al liberar tickets expirados' },
      { status: 500 }
    )
  }
}

// GET endpoint to check how many tickets are expired
export async function GET() {
  try {
    const expiredTickets = await db.ticket.findMany({
      where: {
        status: 'reserved',
        expiresAt: {
          lt: new Date()
        }
      },
      include: {
        user: true,
        payment: true
      }
    })

    const expiringSoon = await db.ticket.findMany({
      where: {
        status: 'reserved',
        expiresAt: {
          gte: new Date(),
          lte: new Date(Date.now() + 5 * 60 * 1000) // Expiring in next 5 minutes
        }
      },
      include: {
        user: true
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        expired: expiredTickets.length,
        expiringSoon: expiringSoon.length
      },
      expiredTickets: expiredTickets.map(t => ({
        ticketNumber: t.number,
        userName: t.user?.name,
        expiresAt: t.expiresAt
      })),
      expiringSoon: expiringSoon.map(t => ({
        ticketNumber: t.number,
        userName: t.user?.name,
        expiresAt: t.expiresAt
      }))
    })

  } catch (error) {
    console.error('Error checking expired tickets:', error)
    return NextResponse.json(
      { error: 'Error al verificar tickets expirados' },
      { status: 500 }
    )
  }
}
