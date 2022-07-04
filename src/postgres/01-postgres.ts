import { PrismaClient } from '@prisma/client'
import { generate } from '../utils/generate'
const prisma = new PrismaClient()

const user = await prisma.user.create(
  {
    data: {
      name: generate.name(),
      age: generate.age(),
    }
  }
)

console.log(user)

const selectedUser = await prisma.user.findFirst({
  where: { id: user.id },
  select: { id: true, name: true, age: false }
})
console.log(selectedUser?.name)
// console.log(selectedUser?.age)

prisma.$disconnect()