import IORedis from 'ioredis'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'

const redis = new IORedis('redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

const id = generate.integer({ min: 1, max: 1000 })

// SET values
await redis.set(`user:${id}:name`, 'John Doe')

// SET expiring value
await redis.set(`user:${id}:age`, 30, 'EX', 60)

// READ values
logger.info({ name: await redis.get(`user:${id}:name`) }, 'User name')

// Iterate over keys matching pattern
const scanResult = await redis.scan(0, "MATCH", `user:${id}:*`, "COUNT", 10)

logger.info({ scan: scanResult }, 'Scan result')

redis.disconnect()