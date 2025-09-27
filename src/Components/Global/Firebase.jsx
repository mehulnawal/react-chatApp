import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyA7QFkqjYNIGzIFwSxuYIGmhCeAVP9m7QA",
    authDomain: "quickchat-190925.firebaseapp.com",
    projectId: "quickchat-190925",
    storageBucket: "quickchat-190925.appspot.com",
    messagingSenderId: "248164173790",
    appId: "1:248164173790:web:2219d8488342298e363f4f",
    measurementId: "G-CNQ7SJ5S8F",
    databaseURL: 'https://quickchat-190925-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
export const Firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(Firebase);