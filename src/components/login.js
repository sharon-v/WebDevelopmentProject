import { fbAuth, dbManager, dbCustomers } from '../firebase/data.js';

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
      checkUserConnected(user);
    })
    .catch((error) => {
      console.log('fail to login');
      let errorMessage = error.message;
      alert(errorMessage);
    });
}

function checkUserConnected(user) {
  // return 0 if a customer is connected and 1 if a manager is connected
  // return -1 if reading the user from collection failed.

  // check if the user is the manager
  dbManager
    .doc(user.email)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('The manager', user.email, 'is connnected');
        location.replace('manager-manage-items.html');
      }
      // check if the user is a customer
      else {
        dbCustomers
          .doc(user.email)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log('The customer', user.email, 'is connnected');
              location.replace('home-page.html');
            }
            else {
              // failed to identify user
              alert('failed to identify user');
              signOutUser();
            }
          })
          .catch((error) => {
            console.log('failed to read from customers collection:', error.message);
            alert(error.message);
          });
      }
    })
    .catch((error) => {
      console.log('failed to read from manager collection:', error.message);
      alert(error.message);
    });
}

function signOutUser() {
  fbAuth
    .signOut()
    .then(() => {

    })
    .catch((error) => {
      console.log('Logout err: ', error);
    });
}
