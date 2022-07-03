import { initializeApp } from 'firebase/app'
import { addDoc, collection, getDoc, getFirestore, terminate } from 'firebase/firestore'
import { generate } from '../utils/generate'

const firebaseConfig = {
  apiKey: 'AIzaSyBvCjqgHYjlI9bLBx9xwsElrDNVJYPAMEo',
  authDomain: 'strv-academy-demo.firebaseapp.com',
  projectId: 'strv-academy-demo',
  storageBucket: 'strv-academy-demo.appspot.com',
  messagingSenderId: '36729939935',
  appId: '1:36729939935:web:01fa0b2bf534b464f6c66a',
  measurementId: 'G-P22D2XQCCX',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

// Add a new document to the database
const docRef = await addDoc(collection(db, 'users'), {
  name: 'Honza',
  age: generate.age(),
})
console.log('Document written to: ', docRef.path)

// Let's read the document back
const document = await getDoc(docRef)
console.log(document.data())

// Generate more data


await terminate(db)
