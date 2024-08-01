// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOt4KstiHp9a1YIe971dOvrMH0mp3at3I",
  authDomain: "inventory-management-7a279.firebaseapp.com",
  projectId: "inventory-management-7a279",
  storageBucket: "inventory-management-7a279.appspot.com",
  messagingSenderId: "529755296145",
  appId: "1:529755296145:web:024faed8aeb184731d8a30",
  measurementId: "G-88L4T64TKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore=getFirestore(app);

export{firestore}