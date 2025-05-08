import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

export { db };
