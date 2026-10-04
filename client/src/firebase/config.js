import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase Configuration from your project
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAlm1aeuBjuS7jNdY0o3AHU79YvQjiRqzE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "blog-5f508.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "blog-5f508",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "blog-5f508.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "299121501531",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:299121501531:web:80202ff78d9599eacae67e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VD6VMF81ZN"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const isRealFirebase = true;

// Initialize Cloud Firestore Database
const db = getFirestore(app);

// Initialize Analytics if supported in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('📊 Firebase Analytics initialized for project blog-5f508');
    }
  }).catch(() => {});
}

console.log('🔥 Firebase Auth & Firestore connected to project: blog-5f508');

export { 
  app, 
  auth, 
  db,
  analytics, 
  googleProvider, 
  isRealFirebase,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithPopup, 
  updateProfile 
};
