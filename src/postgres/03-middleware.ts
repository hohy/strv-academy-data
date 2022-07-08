import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  // Check incoming query type
  if (params.model === 'User') {
    if (params.action === 'delete') {
      // Delete queries
      // Change action to an update
      params.action = 'update'
      params.args['data'] = { deleted: true }
    }
    if (params.action === 'deleteMany') {
      // Delete many queries
      params.action = 'updateMany'
      if (params.args.data != undefined) {
        params.args.data['deleted'] = true
      } else {
        params.args['data'] = { deleted: true }
      }
    }
  }
  return next(params)
})

// Insert our first user record to existing user
let user = await prisma.user.findFirstOrThrow({
  select: { id: true, name: true, deleted: true },
})

logger.info({ user }, 'User before deletion')

await prisma.user.delete({
  where: { id: user.id },
})

user = await prisma.user.findFirstOrThrow({
  where: { id: user.id },
  select: { id: true, name: true, deleted: true },
})

logger.info({ user }, 'User after deletion')
