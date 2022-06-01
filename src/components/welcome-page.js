import { fbAuth, dbManager, dbCustomers} from '../firebase/data.js';

fbAuth.onAuthStateChanged((user) => {
    if (user)
    {   
        checkUserConnected(user);
    }
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
                location.replace('../components/home-page.html');
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
  