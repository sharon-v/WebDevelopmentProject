import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import { getFirestore, collection, getDoc, getDocs} from 'firebase/firestore';

// Initialize Firebase
const firebaseApp = initializeApp({
    apiKey: "AIzaSyDDdaPy08NvYXMSaME11PG4L4mrdXQswL0",
    authDomain: "online--shopping--system.firebaseapp.com",
    projectId: "online--shopping--system",
    storageBucket: "online--shopping--system.appspot.com",
    messagingSenderId: "226441492460",
    appId: "1:226441492460:web:522fc6bb71346b94ba72c9",
    measurementId: "G-3JRYLKGGNL"
});
const analytics = getAnalytics(app);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);


