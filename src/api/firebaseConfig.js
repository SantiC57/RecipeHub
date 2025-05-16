
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYPjH69GW4p-dsbzTUP-oODKvm8v2cCAo",
  authDomain: "recipehub-97175.firebaseapp.com",
  projectId: "recipehub-97175",
  storageBucket: "recipehub-97175.firebasestorage.app",
  messagingSenderId: "532918798239",
  appId: "1:532918798239:web:6803f4793a3f982f035faa",
  measurementId: "G-5TFZ7J7VPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);