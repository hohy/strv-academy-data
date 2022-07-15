import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'
const prisma = new PrismaClient()

// create a new user record and add post record to it
const user = await prisma.user.create({
  data: {
    name: generate.name(),
    email: generate.email(),
    age: generate.age(),
    posts: {
      create: [{
        title: 'First post',
        content: 'This is the first post',
      }]
    }
  }
})

// Insert our first user record
const dbUser = await prisma.user.findFirstOrThrow({
  where: { id: user.id },
  include: { posts: true },
})

logger.info({ posts: dbUser.posts }, 'User with posts')

// // Query the relation other way around
const post = await prisma.post.findFirstOrThrow({
  include: { author: { select: { name: true } } },
})
logger.info({ post }, 'Post with author')


// // Limit included posts to 3
const userWithPosts = await prisma.user.findFirstOrThrow({
  where: { id: user.id },
  include: {
    posts: {
      select: { title: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }
  },
})

logger.info({ posts: userWithPosts.posts }, 'User with posts')

await prisma.$disconnect()