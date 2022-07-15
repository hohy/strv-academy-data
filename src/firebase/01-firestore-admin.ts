import firebase from 'firebase-admin'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'
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

logger.info({ path: docRef.path }, 'Document written to: ')

// Let's read the document back
const document = await db.doc(docRef.path).get()
logger.info(document.data())

// close the connection
await db.terminate()
