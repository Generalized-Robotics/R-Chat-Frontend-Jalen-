// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, signInWithEmailAndPassword } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0a2tp3okw7nsv3teexYJEF4LpMwosCs0",
  authDomain: "r-chat-66d64.firebaseapp.com",
  databaseURL: "https://r-chat-66d64-default-rtdb.firebaseio.com",
  projectId: "r-chat-66d64",
  storageBucket: "r-chat-66d64.appspot.com",
  messagingSenderId: "890322234758",
  appId: "1:890322234758:web:e769bd3423099988af9007",
  measurementId: "G-GMN2MF3HM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export{
    auth,
    signInWithEmailAndPassword
}