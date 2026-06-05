// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDctIrkzHLkoUa2KxChYnidp1ds5V65wa8",
  authDomain: "neolearn360.firebaseapp.com",
  projectId: "neolearn360",
  storageBucket: "neolearn360.firebasestorage.app",
  messagingSenderId: "1026168505780",
  appId: "1:1026168505780:web:2db0593380b3b5f4589ee1",
  measurementId: "G-F19J3KF2CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);