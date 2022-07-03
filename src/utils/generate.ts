import { Chance } from 'chance'

export const generate = new Chance()

interface FirestoreUser {
  first: string
  last: string
  age: number
}

export function generateUser(): FirestoreUser {
  return {
    first: generate.name(),
    last: generate.name_suffix(),
    age: generate.age(),
  }
}
