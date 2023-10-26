import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz7l9Yvp7IjSaZfZprHF0ZM5Bw53D-oek",
  authDomain: "bevoltec.firebaseapp.com",
  projectId: "bevoltec",
  storageBucket: "bevoltec.appspot.com",
  messagingSenderId: "1033852400428",
  appId: "1:1033852400428:web:f3c3b709864d804d44f289"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Exporting the services
export { db, auth, storage, provider };
