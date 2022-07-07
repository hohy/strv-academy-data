/* eslint-disable no-await-in-loop */
import IORedis from 'ioredis'
import mongoose from 'mongoose'
import { delay } from '../utils/delay'
import { PrismaClient } from '@prisma/client'
import { generate } from '../utils/generate'
const prisma = new PrismaClient()

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

// Prepare Posgres
const pgCounter = await prisma.counter.create({
  data: {
    value: 0,
  }
})

const incrementPg: () => Promise<void> = async () => {
  await prisma.counter.update({
    where: { id: pgCounter.id },
    data: {
      value: {
        increment: 1,
      }
    }
  }).then(incrementPg)
}

//const incrementPG: () => Promise<void> = () => redis.incr('user').then(incrementRedis)

async function printStats(): Promise<void> {
  while (true) {
    const counterRedis = await redis.get('counter')
    const counterPostgres = (await prisma.counter.findFirst({ where: { id: pgCounter.id } }))?.value
    const counterMongo = await Data.findById(ref.id).then(doc => doc?.counter)
    console.log(`Redis: ${counterRedis} \t \t Postgres: ${counterPostgres} \t \t Mongo: ${counterMongo}`)
    await delay({ duration: 1000 })
  }
}

// Run everything concurrently
await Promise.all([
  incrementRedis(),
  incrementMongo(),
  incrementPg(),
  printStats(),
])

redis.disconnect()
