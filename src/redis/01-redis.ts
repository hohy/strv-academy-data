import IORedis from 'ioredis'

const redis = new IORedis('redis://localhost:8003', {
  maxRetriesPerRequest: null,
})

await redis.set('user', 1)

const incrementRedis: () => Promise<void> = () => redis.incr('counter').then(incrementRedis)
//const incrementPG: () => Promise<void> = () => redis.incr('user').then(incrementRedis)

await Promise.all([
  incrementRedis(),
])

await redis.incr('user')

redis.disconnect()