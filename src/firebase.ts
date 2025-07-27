// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy8iGpFntE5f1Q12tFqa2j7JUtL36QD6o80",
  authDomain: "woofi-app.firebaseapp.com",
  projectId: "woofi-app",
  storageBucket: "woofi-app.appspot.com",
  messagingSenderId: "214098096726",
  appId: "1:214098096726:web:d07b6b09ec597ce3ecfb7b",
  measurementId: "G-NF2DKGBFGD"
};

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export { db };
