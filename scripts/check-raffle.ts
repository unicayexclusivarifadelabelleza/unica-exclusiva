import { db } from '../src/lib/db'

async function checkRaffles() {
  try {
    const raffles = await db.raffle.findMany({
      where: { status: 'active' },
      include: { prizes: true }
    })

    console.log('Rifas activas encontradas:', raffles.length)
    console.log('Datos:', JSON.stringify(raffles, null, 2))

    await db.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await db.$disconnect()
    process.exit(1)
  }
}

checkRaffles()
