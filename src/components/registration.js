import { state, fbAuth, dbCustomers } from '../firebase/data.js'

console.log('enter');

document.addEventListener('DOMContentLoaded', () => {
	console.log('in');

	// const registerForm = document.querySelector('#regestraion');
	var btn = document.getElementById('submit');
	// when press on sign up button
	btn.addEventListener('click', (e) => {
		e.preventDefault();
		console.log('clicked on register');
		const fname = document.getElementById('registerfName').value;
		const lname = document.getElementById('registerlName').value;
		const birthdate = document.getElementById('registerDate').value;
		const phoneNumber = document.getElementById('registerPhoneNumber').value;
		const email = document.getElementById('registerEmail').value;
		const password = document.getElementById('registerPassword').value;
		const passwordConfirmation = document.getElementById('registerConfirmPassword').value;
		const managerPasscode = document.getElementById('registerManagerPasscode').value;

		// if (checkEmail(email) == false) {
		// 	// write password confirmation message
		// }

		// if (checkPasswordConfiramtion(password, passwordConfirmation) == false) {
		// 	// write password confirmation message
		// }

		console.log(fname);
		console.log(lname);
		console.log(birthdate);
		console.log(phoneNumber);
		console.log(email);
		console.log(password);
		console.log(passwordConfirmation);
		console.log(managerPasscode);

		// forgot password - reseting with firebasse 
		// fbAuth.sendPasswordResetEmail(email)
		// 	.then(() => {
		// 		// Password reset email sent!
		// 		// ..
		// 	})
		// 	.catch((error) => {
		// 		var errorCode = error.code;
		// 		var errorMessage = error.message;
		// 		// ..
		// 	});

		// creating new user with firebase Auth
		fbAuth
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				var user = userCredential.user;
				console.log('success, ', user.uid);
				dbCustomers.doc(email).set({
					fname: fname,
					lname: lname,
					birthdate: birthdate,
					phoneNumber: phoneNumber,
					email: email
				})
					.then(() => {
						console.log('Document successfully written!');
						location.replace('home-page.html');   // move the user to the home page
					})
					.catch((error) => {
						// success in saving the user to Auth but failed to save him in the collection
						// so we need to delete user from authentication
						console.error('Error writing document: ', error);
					});
			})
			.catch((error) => {
				console.log('fail');
				var errorMessage = error.message;
				alert(errorMessage);
			});


		// Perform your AJAX/Fetch login
		// window.location.href = 'welcom.html';   // ?????????????????????????????
	});
});


/* check for invalid password or password confirmation */
function checkPasswordConfirmation(password, passwordConfirmation) {
	console.log(password);
	console.log(passwordConfirmation);
	// check if the passwords are equal 
	if (password != passwordConfirmation) {
		return false;
	}
	else {
		return true;
	}
}

// /* check if the email is invalid */
// function checkEmail(email) {
// 	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

function signUpClient() {

}

function signUpManager() {

}
