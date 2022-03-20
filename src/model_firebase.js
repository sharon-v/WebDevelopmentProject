import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { getFirestore, collection, getDoc, getDocs, addDoc} from 'firebase/firestore';

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

// init services
const analytics = getAnalytics(app);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// collection reference
const usersColRef = collection(db, 'users');

// get collection data
getDocs(usersColRef).then((snapshot) => {
    let users = [];
    snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id })
    })
    console.log(users);
}).catch( err => {
    console.log(err.message);
});

// adding to collection

function addNewUser(user, password) {
    createUserWithEmailAndPassword(auth, user.email).then((cred) => {
        console.log('user created inm auth');
        // adding the user's details to users collection
        addDoc(usersColRef, {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            phoneNumber: user.phoneNumber
        }).then(() => {
            const signUpForm = document.querySelector('#signUp');
            alert("signup in firebase")
            signUpForm.reset();
        })
    })
}

function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password).then((cred)=>{
        // window.location = "welcom.html";
        alert ("Login successfully");
    })
    .catch((err)=>{
        console.log("failed to login, please try again");
    })
}