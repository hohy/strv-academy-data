import { initializeApp } from 'firebase/app'
import firebase from 'firebase-admin'
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { doc, terminate, setDoc, getFirestore } from 'firebase/firestore'
import { generate } from '../utils/generate'
import serviceAccount from './service-account.json'

// Generate auth token for the user
const adminApp = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as Object),
})

const token = await adminApp.auth().createCustomToken(generate.guid())
console.log('Firebase auth token', token)

// Authenticaticate using the token
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

const auth = getAuth(app)
const user = await signInWithCustomToken(auth, token)

console.log('Firebase auth user', user.user.uid)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

// create a new user document
await setDoc(doc(db, 'users', user.user.uid), {
  name: 'User A',
  age: generate.age(),
})

// create a new user document
await setDoc(doc(db, 'users', generate.guid()), {
  name: 'User B',
  age: generate.age(),
})

await terminate(db)
