import mongoose from 'mongoose'
import { generate } from '../utils/generate'

const { Schema, model, connect } = mongoose

interface IUser {
  name: string
  age: number
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  age: { type: Number, required: false },
})

const User = model<IUser>('User', userSchema)

await connect('mongodb://localhost:27017/strv-academy-demo')

const user = new User({
  name: generate.name(),
  age: generate.age(),
})

await user.save()

console.log(user.id)