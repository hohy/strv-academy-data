import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, terminate } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvCjqgHYjlI9bLBx9xwsElrDNVJYPAMEo",
  authDomain: "strv-academy-demo.firebaseapp.com",
  projectId: "strv-academy-demo",
  storageBucket: "strv-academy-demo.appspot.com",
  messagingSenderId: "36729939935",
  appId: "1:36729939935:web:01fa0b2bf534b464f6c66a",
  measurementId: "G-P22D2XQCCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Add a new document to the database
try {
  const docRef = await addDoc(collection(db, "users"), {
    first: "Ada",
    last: "Lovelace",
    born: 1815
  })
  console.log("Document written with ID: ", docRef.id)
} catch (e) {
  console.error("Error adding document: ", e)
}

terminate(db)