import { fbAuth } from '../firebase/data.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('in');

    var btn = document.getElementById('loginBtn');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('clicked on login');
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log(email);
        console.log(password);
        login(email, password);
    });

});

function login(email, password) {
    fbAuth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log('success, ', user.email);
            location.replace('home-page.html');
        })
        .catch((error) => {
            console.log('fail');
            var errorMessage = error.message;
            alert(errorMessage);
        });
}