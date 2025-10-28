import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
 apiKey: "AIzaSyCbKZQuivO4_1iHEb9ai7A13BsEKPoF_gI",
  authDomain: "portfolio-d1452.firebaseapp.com",
  projectId: "portfolio-d1452",
  storageBucket: "portfolio-d1452.appspot.com",
  messagingSenderId: "258759148584",
  appId: "1:258759148584:web:54e0a492fc53137625a11d",
  measurementId: "G-WPJLQS371P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' && import.meta.env.VITE_ENABLE_ANALYTICS === 'true' 
  ? getAnalytics(app) 
  : null;

export default app;