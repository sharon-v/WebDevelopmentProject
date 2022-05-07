import { fbAuth, dbCustomers, dbManager } from '../firebase/data.js';

fetch('../components/navbar.html')
  .then((res) => res.text())
  .then((text) => {
    const oldelem = document.querySelector('script#replace_with_navbar');
    const newelem = document.createElement('div');
    newelem.innerHTML = text;
    oldelem.parentNode.replaceChild(newelem, oldelem);
  });

// reconstructing navbar.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('in');

  var isManager = -1; // if 1 it's a manager, if 0 then it's a customer, -1 if not connectedat all
  isManager = handleNavBar();
});

// gets current user and fix the navbar accordenly
function handleNavBar(isManager) {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // a user is connected
      console.log('user connected');

      // check if manager or customer
      isManager = checkUserConnected(user);
      if (isManager == -1) {
        NoUserConnectedNavbar();
        alert('failed to identify user - loggin out from the account');
        addEventListenersToNavBarButtons(-1);
        signOutUser();
      }
    } else {
      // User is signed out
      isManager = -1;
      NoUserConnectedNavbar();
      addEventListenersToNavBarButtons(isManager);
    }
  });
  return isManager;
}

// log out function
function signOutUser() {
  fbAuth
    .signOut()
    .then(() => {
      location.replace('../components/welcome-page.html');
    })
    .catch((error) => {
      alert('failed to logout');
      console.log('Logout err: ', error);
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
        ManagerNavbar();
        console.log('The manager', user.email, 'is connnected');
        addEventListenersToNavBarButtons(1);
        return 1;
      }
      // check if the user is a customer
      else {
        dbCustomers
          .doc(user.email)
          .get()
          .then((doc) => {
            if (doc.exists) {
              CustomerNavbar();
              console.log('The customer', user.email, 'is connnected');
              addEventListenersToNavBarButtons(0);
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

function addEventListenersToNavBarButtons(isManager) {
  // logout icon function
  // const logoutBtn = document.querySelector('#nav_logout_btn');
  const logoutBtn = document.getElementById('nav_logout_btn');
  logoutBtn.addEventListener('click', function () {
    if (isManager != -1) {
      signOutUser();
    }
  });

  // bed icon function
  // const nav_bed_btn = document.querySelector('#nav_bed_btn');
  const nav_bed_btn = document.getElementById('nav_bed_btn');
  nav_bed_btn.addEventListener('click', () => {
    if (isManager == -1) {
      location.replace('welcome-page.html'); // redirect a disconnected user to the home page
    } else if (isManager == 0) {
      location.replace('home-page.html'); // redirect a connected user to the home page
    }
  });

  // function to send user to right profile page -> profile icon
  const nav_profile_btn = document.getElementById('nav_profile_btn');
  nav_profile_btn.addEventListener('click', () => {
    if (isManager == 1) {
      location.replace('manager-manage-items.html'); // redirect a disconnected user to the home page
    } else {
      location.replace('profile.html'); // redirect a connected user to the home page
    }
  });
}

function ManagerNavbar() {
  document.getElementById('nav_item_profile').style.display = 'block';
  document.getElementById('nav_item_logout').style.display = 'block';
}

function CustomerNavbar() {
  // login and logout already hidden
  document.getElementById('nav_item_home').style.display = 'block';
  document.getElementById('nav_item_catalog').style.display = 'block';
  document.getElementById('nav_item_cart_and_badge').style.display = 'block';
  document.getElementById('nav_item_wishlist').style.display = 'block';
  document.getElementById('nav_item_profile').style.display = 'block';
  document.getElementById('nav_item_logout').style.display = 'block';
}

function NoUserConnectedNavbar() {
  console.log('no user connected');
  document.getElementById('nav_item_login').style.display = 'block';
  document.getElementById('nav_item_register').style.display = 'block';
}
