import { fbAuth, dbCustomers, dbManager, dbDeveloperPasscode } from '../firebase/data.js'

console.log('enter');

document.addEventListener('DOMContentLoaded', () => {
  console.log('in');

  // const registerForm = document.querySelector('#regestraion');
  var btn = document.getElementById('submit');
  // when press on sign up button
  btn.addEventListener('click', (e) => {
    e.preventDefault();  // IMPORTANT! so the db functions could work, DO NOT REMOVE
    console.log('clicked on register');

    // getting the registration details from the html
    const fname = document.getElementById('registerfName').value;
    const lname = document.getElementById('registerlName').value;
    const birthdate = document.getElementById('registerDate').value;
    const phoneNumber = document.getElementById('registerPhoneNumber').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirmation = document.getElementById('registerConfirmPassword').value;
    const managerPasscode = document.getElementById('registerManagerPasscode').value;
    const isCbChecked = document.getElementById('registerManagerCheckBox').checked;

    // writing data collected for testing
    console.log(fname);
    console.log(lname);
    console.log(birthdate);
    console.log(phoneNumber);
    console.log(email);
    console.log(password);
    console.log(passwordConfirmation);
    console.log(managerPasscode);

    if (isCbChecked) {
      console.log('cb is checked');
      managerSignUp(fname, lname, birthdate, phoneNumber, email, password, passwordConfirmation, managerPasscode);
    }
    else {
      customerSignUp(fname, lname, birthdate, phoneNumber, email, password, passwordConfirmation);
    }

  });
});


/* check for invalid password or password confirmation */
function checkPasswordConfirmation(password, passwordConfirmation) {
  // check if the passwords are equal 
  if (password != passwordConfirmation) {
    alert('passwords do not match');
    return false;
  }
  else {
    return true;
  }
}

function customerSignUp(fname, lname, birthdate, phoneNumber, email, password, passwordConfirmation) {
  if (checkPasswordConfirmation(password, passwordConfirmation)) {
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
          email: email   // need to consider removing it
        })
          .then(() => {
            console.log('Document successfully written!');
            location.replace('home-page.html');   // redirect the user to the home page
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
  }
}

function managerSignUp(fname, lname, birthdate, phoneNumber, email, password, passwordConfirmation, managerPasscode) {
  console.log('in manager sign up');
  // check if a manager already signed up to our website
  dbManager.get().then(function (querySnapshot) {
    if (!querySnapshot.empty) {
      alert('A manager is already signed up to the website');
      return;
    }
    else {
      if (!checkPasswordConfirmation(password, passwordConfirmation)) {
        return;
      }
      // checking developer passcode
      var x = '';
      dbDeveloperPasscode.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          x = doc.data();
        });
        console.log('developer passcode:', x.passcode, String(x).length);
        console.log('manager passcode:', managerPasscode);
        console.log('manager passcode length:', String(managerPasscode).length);
        if (String(managerPasscode) === String(x)) {
          // if (String(managerPasscode).localeCompare(String(x)) != 0) {  // doesn't 
          console.log('error in matching developer passcode');
          alert('developer passcode is not correct')
        }
        else {
          // creating the manager user in the DB
          addManagerToTheDb(fname, lname, birthdate, phoneNumber, email, password)
        }
      });
    }
  });
}

function addManagerToTheDb(fname, lname, birthdate, phoneNumber, email, password) {
  // creating the manager user in the DB
  fbAuth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log('success, ', user.uid);
      dbManager.doc(email).set({
        fname: fname,
        lname: lname,
        birthdate: birthdate,
        phoneNumber: phoneNumber,
        email: email   // need to consider removing it
      })
        .then(() => {
          console.log('Document successfully written!');
          location.replace('home-page.html');   // redirect the user to the home page
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
}

function compareSrings(a, b) {

}