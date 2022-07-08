import { Chance } from 'chance'

export const generate = new Chance()

interface IUser {
  name: string
  email: string
  age: number
}

export function generateUser(): IUser {
  return {
    name: generate.name(),
    email: generate.email(),
    age: generate.age(),
  }
}
