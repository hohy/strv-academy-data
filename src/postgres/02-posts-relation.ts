import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
import { generate, generateUser } from '../utils/generate'
import { logger } from '../utils/logger'
const prisma = new PrismaClient()

// Find some user record in db
let user = await prisma.user.findFirstOrThrow({
  include: { posts: true },
})

// There should be no posts yet
logger.info({ posts: user.posts }, 'User with posts')

await prisma.post.create({
  data: {
    title: 'My first post',
    content: 'This is my first post',
    authorId: user.id,
  }
})

// Insert our first user record
user = await prisma.user.findFirstOrThrow({
  include: { posts: true },
})

logger.info({ posts: user.posts }, 'User with posts')

// Query the relation other way around
const post = await prisma.post.findFirstOrThrow({
  include: { author: { select: { name: true } } },
})
logger.info({ post }, 'Post with author')


// Limit included posts to 3
const userWithPosts = await prisma.user.findFirstOrThrow({
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