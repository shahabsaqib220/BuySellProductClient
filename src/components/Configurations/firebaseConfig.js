// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDQdae2ih1tQc0Wt9tB3Q-4KUl2wnT3VoA",
  authDomain: "buysell-2450a.firebaseapp.com",
  projectId: "buysell-2450a",
  storageBucket: "buysell-2450a.appspot.com",
  messagingSenderId: "317681182837",
  appId: "1:317681182837:web:0f8e66fd9d880c8179f03c",
  measurementId: "G-KNKTM3G7F5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };