
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTchZJL91yPWsUSGEW_OQf1JOVzGpwJu8",
  authDomain: "prescription-5375b.firebaseapp.com",
  projectId: "prescription-5375b",
  storageBucket: "prescription-5375b.appspot.com",
  messagingSenderId: "950261219639",
  appId: "1:950261219639:web:6b3b6f68e4ed3a26290b3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
