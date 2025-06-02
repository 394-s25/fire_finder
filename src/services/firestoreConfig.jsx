import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRMy1c13u1_UgZl7MpeqIowDmkJcOSMJg",
  authDomain: "fire-finder-8ba40.firebaseapp.com",
  projectId: "fire-finder-8ba40",
  storageBucket: "fire-finder-8ba40.firebasestorage.app",
  messagingSenderId: "925360612076",
  appId: "1:925360612076:web:9988fc74a4e04105d3bbc9",
  measurementId: "G-S7VGMTXE6X",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase persistence error:", error.message);
});

const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
