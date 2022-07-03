import firebase from 'firebase-admin'
import { generate } from '../utils/generate'
import serviceAccount from './service-account.json'

// Initialize Cloud Firestore and get a reference to the service
const app = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as Object),
})

const db = app.firestore()
// Add a new document to the database

const docRef = await db.collection('users').add({
  name: 'Honza',
  age: generate.age(),
})

console.log('Document written to: ', docRef.path)

// Let's read the document back
const document = await db.doc(docRef.path).get()
console.log(document.data())

// Generate more data

// close the connection
await db.terminate()
