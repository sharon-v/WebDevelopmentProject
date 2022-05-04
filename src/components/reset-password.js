import { fbAuth } from '../firebase/data.js'

document.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById('resetPasswordBtn');
    // when press on sign up button
    btn.addEventListener('click', (e) => {
        e.preventDefault();  // IMPORTANT! so the db functions could work, DO NOT REMOVE
        console.log('clicked on register');
        const email = document.getElementById('resetPasswordEmail').value;

        // forgot password - reseting with firebasse!
        fbAuth.sendPasswordResetEmail(email)
            .then(() => {
                alert('check your email accout for a reset password mail');
                location.replace('login.html');   // redirect the user to the home page
            })
            .catch((error) => {
                var errorMessage = error.message;
                alert(errorMessage);
            });
    });
});