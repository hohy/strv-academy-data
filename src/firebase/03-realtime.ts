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
const docRef = await db.collection('messages').add({
  msg: generate.sentence(),
})

logger.info({ path: docRef.path }, 'Document written')

// Let's listen for updates in messages collection
const msgRef = db.collection('messages')
const unsubscribe = msgRef.onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    logger.info({ change: change.type, key: change.doc.id, data: change.doc.data() }, 'New update in database')
  })
})
