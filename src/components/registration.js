function sendJSON() {
	// let result = document.querySelector('.result');
	let name = document.querySelector('#name');
	let email = document.querySelector('#email');

	// Creating a XHR object
	let xhr = new XMLHttpRequest();
	let url = "submit.php";

	// open a connection
	xhr.open("POST", url, true);

	// Set the request header i.e. which type of content you are sending
	xhr.setRequestHeader("Content-Type", "application/json");

	// Create a state change callback
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {

			// Print received data from server
			result.innerHTML = this.responseText;

		}
	};

	// Converting JSON data to string
	var data = JSON.stringify({ "name": name.value, "email": email.value });

	// Sending data with the request
	xhr.send(data);
}

document.addEventListener('DOMContentLoaded', () => {
	const registerForm = document.querySelector('#regestraion');
	// when press on sign up button
	registerForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const fname = document.getElementById('registerfName').value;
		const lname = document.getElementById('registerlName').value;
		const birthdate = document.getElementById('registerDate').value;
		const phoneNumber = document.getElementById('registerPhoneNumber').value;
		const email = document.getElementById('registerEmail').value;
		const password = document.getElementById('registerPassword').value;
		const passwordConfirmation = document.getElementById('registerConfirmPassword').value;
		const managerPasscode = document.getElementById('registerManagerPasscode').value;

		// Perform your AJAX/Fetch login
		window.location.href = 'welcom.html';   // ?????????????????????????????
	});
});

/* check if the email is invalid */
function emailIsValid(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


