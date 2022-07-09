import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
import { logger } from '../utils/logger'
const prisma = new PrismaClient()

let sender = await prisma.user.findFirstOrThrow({ where: { balance: { gt: 0 } } })
let recipient = await prisma.user.findFirstOrThrow({ where: { id: { not: sender.id } } })

logger.info({ sender, recipient }, 'Sender and recipient')

const amount = 100

await prisma.$transaction(async (prisma) => {
  // Remove balance from one user account
  sender = await prisma.user.update({
    data: {
      balance: {
        decrement: amount
      }
    },
    where: {
      id: sender.id
    }
  })

  if (sender.balance.isNegative()) {
    throw new Error('Insufficient funds')
  }

  // Add balance to another user account
  recipient = await prisma.user.update({
    data: {
      balance: {
        increment: amount
      }
    },
    where: {
      id: recipient.id
    }
  })
})

logger.info({ sender, recipient }, 'Sender and recipient')