
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJa6MOWvizi6xWCuOGXnaFIvjcyQkM60w",
  authDomain: "prescription-5375b.firebaseapp.com",
  projectId: "prescription-5375b",
  storageBucket: "prescription-5375b.firebasestorage.app",
  messagingSenderId: "683791249308",
  appId: "1:683791249308:web:229cfcc5bd583b9723e259",
  measurementId: "G-N8R4P0DC65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
