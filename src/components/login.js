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
        return 1;
      }
      // check if the user is a customer
      else {
        dbCustomers
          .doc(user.email)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log('The customer', user.email, 'is connnected');

              return 0;
            } else {
              return -1; // failed to identify user
            }
          })
          .catch((error) => {
            console.log('failed to read from customers collection:', error);
            return -1; // failed to identify user
          });
      }
    })
    .catch((error) => {
      console.log('failed to read from manager collection:', error);
      return -1;
    });
}

function login(email, password) {
  fbAuth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log('success, ', user.email);
      var isManager = checkUserConnected(user);
      console.log('is manager = ', isManager);
      if (isManager == 1) {
        location.replace('manager-manage-item.html');
      } else if (isManager == 0) {
        location.replace('../components/home-page.html');
      } else {
        location.replace('login.html');
      }
    })
    .catch((error) => {
      console.log('fail');
      var errorMessage = error.message;
      alert(errorMessage);
    });
}
