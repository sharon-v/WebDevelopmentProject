import { fbAuth } from '../firebase/data.js';

// Set database variable
//var database = firebase.firestore();
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('in');

// const registerForm = document.querySelector('#regestraion');
var btn = document.getElementById('loginBtn');
// when press on sign up button
btn.addEventListener('click', () => {
    //e.preventDefault();
    console.log('clicked on register');
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    // if (checkEmail(email) == false) {
    //     // write password confirmation message
    // }

    // if (checkPasswordConfiramtion(password, passwordConfirmation) == false) {
    //     // write password confirmation message
    // }

    console.log(name);
    console.log(password);
    fbAuth
        .signInWithEmailAndPassword(name, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log('success, ', user.uid);
            location.replace("home-page.html");
        })
        .catch((error) => {
            console.log('fail');
            var errorMessage = error.message;
            alert(errorMessage);
        });

});


function login() {
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_pass").value;
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            location.replace("registered_home.html");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode);
        });
}