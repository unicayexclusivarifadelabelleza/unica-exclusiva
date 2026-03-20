import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Link de pago dinámico de Mercado Pago
const MERCADO_PAGO_DYNAMIC_LINK = 'https://link.mercadopago.cl/rifaunicayexclusiva'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tickets, customerName, customerPhone, customerEmail, ticketPrice, ticketType } = body

    // Validate input
    if (!tickets || tickets.length === 0) {
      return NextResponse.json(
        { error: 'Por favor selecciona al menos un boleto' },
        { status: 400 }
      )
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Nombre y teléfono son requeridos' },
        { status: 400 }
      )
    }

    // Get or create active raffle for this ticket price
    let raffle = await db.raffle.findFirst({
      where: {
        status: 'active',
        ticketPrice: ticketPrice
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // If no active raffle exists, create one with 100 tickets
    if (!raffle) {
      raffle = await db.raffle.create({
        data: {
          title: `Rifa de Belleza - ${ticketType}`,
          description: `Rifa con boletos de $${ticketPrice.toLocaleString()}`,
          status: 'active',
          ticketPrice: ticketPrice,
          maxTickets: 100
        }
      })

      // Create 100 tickets for new raffle
      const ticketData = Array.from({ length: 100 }, (_, i) => ({
        number: i + 1,
        raffleId: raffle.id,
        status: 'available'
      }))

      await db.ticket.createMany({
        data: ticketData
      })
    }

    // Check if tickets are available
    const availableTickets = await db.ticket.findMany({
      where: {
        raffleId: raffle.id,
        status: 'available'
      }
    })

    const ticketNumbers = tickets.map(t => t)
    const unavailableTickets = ticketNumbers.filter(tn => {
      const exists = availableTickets.find(at => at.number === tn)
      return !exists
    })

    if (unavailableTickets.length > 0) {
      return NextResponse.json(
        { error: `Los siguientes boletos no están disponibles: ${unavailableTickets.join(', ')}` },
        { status: 400 }
      )
    }

    // Create or update user using phone as part of email for uniqueness
    const user = await db.user.upsert({
      where: {
        email: `${customerPhone}@temp.local`
      },
      create: {
        name: customerName,
        phone: customerPhone,
        email: `${customerPhone}@temp.local`
      },
      update: {
        name: customerName,
        phone: customerPhone
      }
    })

    // Calculate total
    const total = ticketNumbers.length * ticketPrice

    // Create payment record (pending)
    const payment = await db.payment.create({
      data: {
        userId: user.id,
        amount: total,
        paymentMethod: 'mercadopago',
        status: 'pending',
        transactionId: `MP_${Date.now()}_${user.id}`,
        preferenceId: `${ticketPrice}_${ticketNumbers.join('_')}_${Date.now()}`,
        metadata: JSON.stringify({
          ticketNumbers,
          ticketType,
          ticketPrice,
          ticketCount: ticketNumbers.length,
          raffleId: raffle.id,
          customerPhone,
          customerEmail
        })
      }
    })

    // Update tickets to sold and associate with payment
    await Promise.all(
      ticketNumbers.map(async (ticketNumber) => {
        const ticket = await db.ticket.findFirst({
          where: {
            raffleId: raffle.id,
            number: ticketNumber,
            status: 'available'
          }
        })

        if (!ticket) {
          throw new Error(`Boleto #${ticketNumber} no disponible`)
        }

        return await db.ticket.update({
          where: { id: ticket.id },
          data: {
            status: 'sold',
            userId: user.id,
            paymentId: payment.id,
            soldAt: new Date()
          }
        })
      })
    )

    // Use the dynamic Mercado Pago link
    // The user will be redirected to this link and can pay the exact amount
    const paymentUrl = MERCADO_PAGO_DYNAMIC_LINK

    return NextResponse.json({
      success: true,
      paymentUrl,
      ticketCount: ticketNumbers.length,
      total,
      ticketPrice,
      ticketNumbers,
      message: 'Redirigiendo a Mercado Pago...',
      instructions: `Total a pagar: $${total.toLocaleString()} CLP por ${ticketNumbers.length} boleto(s)`
    })

  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la compra. Por favor intenta nuevamente.' },
      { status: 500 }
    )
  }
}
