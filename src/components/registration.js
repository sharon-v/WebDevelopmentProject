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


function customerSignUp(fname, lname, birthdate, phoneNumber, email, password, passwordConfirmation) {
  if (!validateForm(fname, lname, birthdate, phoneNumber, password)) {
    return;
  }
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
            console.error('Error in adding the user to customers collection: ', error);
            var errorMessage = error.message;
            alert(errorMessage);
            deleteUserFromAuth(user);
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
      if (!validateForm(fname, lname, birthdate, phoneNumber, password)) {
        return;
      }
      if (!checkPasswordConfirmation(password, passwordConfirmation)) {
        return;
      }
      // checking developer passcode
      var x = '';
      dbDeveloperPasscode.doc('passcode').get().then((querySnapshot) => {
        x = querySnapshot.data().passcode;
        console.log('developer passcode:', x.passcode, String(x).length);
        console.log('manager passcode:', managerPasscode);
        console.log('manager passcode length:', String(managerPasscode).length);
        if (String(managerPasscode) != String(x)) {
          // if (String(managerPasscode).localeCompare(String(x)) != 0) {  // doesn't 
          console.log('error in matching developer passcode');
          alert('developer passcode is not correct');
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
          location.replace('manager-manage-items.html');   // redirect the user to the home page
        })
        .catch((error) => {
          // success in saving the user to Auth but failed to save him in the collection
          // so we need to delete user from authentication
          console.error('Error writing document: ', error);
          var errorMessage = error.message;
          alert(errorMessage);
          deleteUserFromAuth(user);
        });
    })
    .catch((error) => {
      console.log('fail');
      var errorMessage = error.message;
      alert(errorMessage);
    });
}


function deleteUserFromAuth(user) {
  user.delete().then(() => {
    // User deleted.
    console.log('user deleted from the auth');
  }).catch((error) => {
    // An error ocurred
    console.log('failed to deleted the user from auth:', error.message);
  });
}

function checkPhoneNumber(phoneNumber) {
  if (/^[0-9]+$/.test(phoneNumber)) {
    console.log('phone-length', phoneNumber.length);
    if (phoneNumber.length != 10) {
      alert('Phone number should be 10 digis long');
      return false;
    }
    return true;
  }
  else {
    alert('phone number should contain digits only');
    return false;
  }
}


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

function checkValidBirdate(birthdate) {
  //Check whether valid dd/MM/yyyy Date Format.
  if (birthdate > '1910-01-01') {
    var parts = birthdate.split("-");
    var dtYear = parts[0];
    var dtMonth = parts[1];
    var dtDay = parts[2];
    console.log('date: ', dtDay, '/', dtMonth, '/', dtYear);
    var dtCurrent = new Date();
    console.log('current date: ', dtCurrent);
    if (dtCurrent.getFullYear() - dtYear < 18) {
      alert('Invalid birthdate - You need to be atleast 18 years old to sign up');
      return false;
    }

    if (dtCurrent.getFullYear() - dtYear == 18) {
      //CD: 11/06/2018 and DB: 15/07/2000. Will turned 18 on 15/07/2018.
      if (dtCurrent.getMonth() < dtDOB.getMonth()) {
        alert('Invalid birthdate - You need to be atleast 18 years old to sign up');
        return false;
      }
      if (dtCurrent.getMonth() == dtMonth) {
        //CD: 11/06/2018 and DB: 15/06/2000. Will turned 18 on 15/06/2018.
        if (dtCurrent.getDate() < dtDOB.getDate()) {
          alert('Invalid birtdate - You need to be atleast 18 years old to sign up');
          return false;
        }
      }
    }
    return true;

  } else {
    alert('Invalid birthdate');
    return false;
  }
}



function validateForm(fname, lname, birthdate, phoneNumber, password) {
  if (fname == null || fname == "") {
    alert("Please Fill First Name Field");
    return false;
  }

  if (lname == null || lname == "") {
    alert("Please Fill Last Name Field");
    return false;
  }

  if (birthdate == null || birthdate == "") {
    alert("Please Fill Birthdate Field");
    return false;
  }

  if (!checkValidBirdate(birthdate)) {
    return false;
  }

  if (!checkPhoneNumber(phoneNumber)) {
    return false;
  }

  if (password == null || password == "") {
    alert("Please Fill Password Field");
    return false;
  }

  if (password.length < 6) {
    alert('Password should be at least 6 characters');
    return false;
  }

  return true;
}