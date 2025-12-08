import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.order.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  const users = [
    {
      imie: 'Test',
      nazwisko: 'User',
      mail: 'test@example.com',
      telefon: '123456789',
      rola: 'user',
      haslo: 'password123',
    },
    {
      imie: 'Admin',
      nazwisko: 'User',
      mail: 'admin@example.com',
      telefon: '987654321',
      rola: 'admin',
      haslo: 'admin123',
    },
    {
      imie: 'Jan',
      nazwisko: 'Kowalski',
      mail: 'jan@example.com',
      telefon: '111222333',
      rola: 'user',
      haslo: 'haslo123',
    },
  ]

  for (const userData of users) {
    const haslo = userData.haslo
    const hashed = await bcrypt.hash(haslo, 10)

    const user = await prisma.user.create({
      data: {
        imie: userData.imie,
        nazwisko: userData.nazwisko,
        mail: userData.mail,
        telefon: userData.telefon,
        rola: userData.rola,
        haslo: hashed,
      },
    })

    console.log(`✅ Created user: ${user.mail} (password: ${haslo})`)
  }

  // Create sample orders
  const testUser = await prisma.user.findUnique({ where: { mail: 'test@example.com' } })
  if (testUser) {
    const order = await prisma.order.create({
      data: {
        nazwa: 'Wymiana olejów',
        status: 'nowe',
        opis: 'Wymiana olejów i filtrów',
        uzytkownik_id: testUser.id,
      },
    })
    console.log(`✅ Created order: ${order.nazwa}`)
  }

  console.log('✨ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
