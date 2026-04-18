import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo9tDA4G8CBvpd28N4IP4JV1i-LAVaeEQ",
  authDomain: "citizen-dashboard.firebaseapp.com",
  projectId: "citizen-dashboard",
  storageBucket: "citizen-dashboard.firebasestorage.app",
  messagingSenderId: "33601547038",
  appId: "1:33601547038:web:907f8b3d26fb38351eb70f",
  measurementId: "G-BD33E1JC19"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics (Client-side only)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes ? (analytics = getAnalytics(app)) : null);
}

// Export instances and modular functions for project-wide use
export { 
  app, 
  db, 
  auth, 
  analytics,
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp 
};
