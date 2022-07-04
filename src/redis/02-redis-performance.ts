/* eslint-disable no-await-in-loop */
import IORedis from 'ioredis'
import { delay } from '../utils/delay'

const redis = new IORedis('redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

await redis.set('counter', 0)

const incrementRedis: () => Promise<void> = async () => await redis.incr('counter')
  .then(incrementRedis)
//const incrementPG: () => Promise<void> = () => redis.incr('user').then(incrementRedis)

async function printStats(): Promise<void> {
  while (true) {
    const counterRedis = await redis.get('counter')
    const counterPostgres = 0
    console.log(`Redis: ${counterRedis} \t \t Postgres: ${counterPostgres}`)
    await delay({ duration: 1000 })
  }
}

// Run everything concurrently
await Promise.all([
  incrementRedis(),
  printStats(),
])

redis.disconnect()
