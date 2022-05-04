import {
    fbAuth,
    dbCustomers,
    dbManager
} from '../firebase/data.js';

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
    nav_profile_btn.addEventListener('click', () => {
        if (isManager == 0) {
            location.replace('#'); // redirect a disconnected user to the home page
        } else {
            location.replace('profile.html'); // redirect a connected user to the home page
        }
    });

});


// gets current user and fix the navbar accordenly
function handleNavBar(isManager) {
    fbAuth.onAuthStateChanged((user) => {
        if (user) {
            // a user is connected
            console.log('user connected');

            // check if manager or customer
            isManager = checkUserConnected(user);
            if (isManager == 1) {
                document.getElementById('nav_home_btn').style.visibility = 'hidden';
                document.getElementById('nav_catalog_btn').style.visibility = 'hidden';
                document.getElementById('nav_cart_and_badge').style.visibility = 'hidden';
                document.getElementById('nav_wishlist_btn').style.visibility = 'hidden';
                document.getElementById('nav_profile_btn').style.visibility = 'hidden';
                document.getElementById('nav_login_link').style.visibility = 'hidden';
                document.getElementById('nav_register_link').style.visibility = 'hidden';
            }

            // check if customer
            if (isManager != -1) {
                document.getElementById('nav_login_link').style.visibility = 'hidden';
                document.getElementById('nav_register_link').style.visibility = 'hidden';
            }

            // no user connected or failed to read user from db
            else {
                navbarForNoUserConnected();
                signOutUser();
            }

        } else {
            // User is signed out
            isManager = -1;
            navbarForNoUserConnected();
        }
    });
    return isManager;
}



// log out function
function signOutUser() {
    fbAuth.signOut().then(() => {
        location.replace('welcome-page.html');
    }).catch((error) => {
        alert('failed to logout');
        console.log('Logout err: ', error);
    });
}

function checkUserConnected(user) {
    // return 0 if a customer is connected and 1 if a manager is connected
    // return -1 if reading the user from collection failed.
    dbManager.doc(user.email)
        .get().then((doc) => {
            if (doc.exists) {
                console.log('The manager is connnected');
                return 1;
            }
        }).catch((error) => {
            console.log('failed to read from manager collection:', error);
        });

    dbCustomers.doc(user.email)
        .get().then((doc) => {
            if (doc.exists) {
                console.log('The user', user.email, 'is connnected');
                return 0;
            }
            else {
                return -1;  // failed to identify user
            }
        }).catch((error) => {
            console.log('failed to read from customers collection:', error);
            return -1;  // failed to identify user
        });
}

function navbarForNoUserConnected() {
    console.log('no user connected');
    document.getElementById('nav_home_btn').style.visibility = 'hidden';
    document.getElementById('nav_catalog_btn').style.visibility = 'hidden';
    document.getElementById('nav_cart_and_badge').style.visibility = 'hidden';
    document.getElementById('nav_wishlist_btn').style.visibility = 'hidden';
    document.getElementById('nav_profile_btn').style.visibility = 'hidden';
    document.getElementById('nav_logout_btn').style.visibility = 'hidden';
}