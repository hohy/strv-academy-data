import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
import { generate, generateUser } from '../utils/generate'
import { logger } from '../utils/logger'
const prisma = new PrismaClient()

// Insert our first user record
const user = await prisma.user.create(
  {
    data: {
      name: generate.name(),
      email: generate.email(),
      age: generate.age(),
    }
  }
)

logger.info({ user }, 'User created')

const selectedUser = await prisma.user.findFirst({
  where: { id: user.id },
  select: { id: true, name: true, age: false }
})
logger.info({ user: selectedUser?.name }, 'User selected')

// Let's add more users
await prisma.user.createMany({
  data: _.times(100, () => ({
    name: generate.name(),
    email: generate.email(),
    age: generate.age(),
  }))
})

// Count all users in the users table
const count = await prisma.user.count()
logger.info(`There are ${count} users in the database`)

// Filter by name
const johns = await prisma.user.findMany({
  where: { name: { startsWith: 'John' } },
  select: { name: true }
})
logger.info({ johns }, 'Johns')

// Find old people
const oldestPeople = await prisma.user.findMany({
  select: { name: true, age: true },
  orderBy: { age: 'desc' },
  take: 3,
})
logger.info({ oldestPeople }, 'Oldest people')

// Raw SQL queries
const raw = await prisma.$queryRaw`SELECT * FROM "users" WHERE email = ${user.email}`;
logger.info({ raw }, 'Raw SQL query result');

// Transactions


await prisma.$disconnect()