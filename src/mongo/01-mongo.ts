import mongoose from 'mongoose'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'
import _ from 'lodash'

logger.info('Mongoose demo')

const { Schema, model, connect } = mongoose

interface IUser {
  name: string
  age?: number
  email: string
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  age: { type: Number, required: false },
  email: { type: String, required: true, unique: true },
})

const User = model<IUser>('User', userSchema)

const db = await connect('mongodb://localhost:27017/strv-academy-demo')

// Clean db from previous run
await User.remove({})

// Insert a new user record
const newUser = new User({
  name: generate.name(),
  age: generate.age(),
  email: generate.email(),
})

const result = await newUser.save()
logger.info({ id: result.id }, 'Assigned user id')

// Query the user back
const user = await User.findById(result.id, { name: 0 })
// TS is not signaling any errors although we want to print name, but it's excluded in the query
logger.info({ name: user?.name, age: user?.age }, 'User read from database')

// Create some more users
await User.insertMany(_.times(100, () => ({
  name: generate.name(),
  age: generate.age(),
  email: generate.email(),
})))

// Count all users in the users collection
let count = await User.countDocuments()
logger.info({ count }, 'User count')

// Count users older than 50
count = await User.countDocuments({ age: { $gt: 50 } })
logger.info({ count }, 'User over 50 count')

const averageAge = await User.aggregate([
  {
    $group: {
      _id: null,
      averageAge: { $avg: "$age" }
    }
  }
])

logger.info({ averageAge }, 'Average age')

await db.disconnect()