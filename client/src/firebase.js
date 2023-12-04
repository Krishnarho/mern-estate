// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-ff199.firebaseapp.com",
    projectId: "mern-estate-ff199",
    storageBucket: "mern-estate-ff199.appspot.com",
    messagingSenderId: "131460147447",
    appId: "1:131460147447:web:06476c19df897c69484bf2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);