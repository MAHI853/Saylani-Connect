// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA98aJ9G42_-9b7FfzJvPUiPseXpzRUD24",
  authDomain: "smit-job-portal-a7ac3.firebaseapp.com",
  projectId: "smit-job-portal-a7ac3",
  storageBucket: "smit-job-portal-a7ac3.firebasestorage.app",
  messagingSenderId: "8567858579",
  appId: "1:8567858579:web:40224124098bad86f33466",
  measurementId: "G-0SYSJ0YBT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);