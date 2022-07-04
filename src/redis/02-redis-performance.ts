/* eslint-disable no-await-in-loop */
import IORedis from 'ioredis'
import mongoose from 'mongoose'
import { delay } from '../utils/delay'

console.log('Performance test')

// Prepare Redis
const redis = new IORedis('redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

await redis.set('counter', 0)

const incrementRedis: () => Promise<void> = async () => await redis.incr('counter')
  .then(incrementRedis)

// Prepare MongoDB
const { Schema, model, connect } = mongoose

interface IData {
  counter: number
}

const dataSchema = new Schema<IData>({
  counter: { type: Number, required: true },
})

const Data = model<IData>('Data', dataSchema)

await connect('mongodb://localhost:27017/strv-academy-demo')

const data = new Data({
  counter: 0,
})

const ref = await data.save()

const incrementMongo: () => Promise<void> = async () => {
  await ref.updateOne({ $inc: { counter: 1 } }).then(incrementMongo)
}

//const incrementPG: () => Promise<void> = () => redis.incr('user').then(incrementRedis)

async function printStats(): Promise<void> {
  while (true) {
    const counterRedis = await redis.get('counter')
    const counterPostgres = 0
    const counterMongo = await Data.findById(ref.id).then(doc => doc?.counter)
    console.log(`Redis: ${counterRedis} \t \t Postgres: ${counterPostgres} \t \t Mongo: ${counterMongo}`)
    await delay({ duration: 1000 })
  }
}

// Run everything concurrently
await Promise.all([
  incrementRedis(),
  incrementMongo(),
  printStats(),
])

redis.disconnect()
