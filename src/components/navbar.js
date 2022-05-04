import {
    fbAuth
} from '../firebase/data.js';

const isManager = -1; // if 1 then true, if 0 then false

fetch('../components/navbar.html')
    .then((res) => res.text())
    .then((text) => {
        const oldelem = document.querySelector('script#replace_with_navbar');
        const newelem = document.createElement('div');
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
    });

// gets current user
fbAuth.onAuthStateChanged((user) => {
    if (user) {
        isManager = 1;
        console.log('inside user if');
        // check if manager 
        // TODO: check if working!!!
        if (dbManager.getElementById(user.email)) {
            document.getElementById('nav_home_btn').style.visibility = 'hidden';
            document.getElementById('nav_catalog_btn').style.visibility = 'hidden';
            document.getElementById('nav_cart_and_badge').style.visibility = 'hidden';
            document.getElementById('nav_wishlist_btn').style.visibility = 'hidden';
            document.getElementById('nav_profile_btn').style.visibility = 'hidden';
            document.getElementById('nav_login_link').style.visibility = 'hidden';
            document.getElementById('nav_register_link').style.visibility = 'hidden';

        }


        // check if customer
        if (dbManager.getElementById(user.email)) {
            isManager = 0;
            document.getElementById('nav_login_link').style.visibility = 'hidden';
            document.getElementById('nav_register_link').style.visibility = 'hidden';
        }

    } else {
        console.log('inside user else');
        // User is signed out
        document.getElementById('nav_home_btn').style.visibility = 'hidden';
        document.getElementById('nav_catalog_btn').style.visibility = 'hidden';
        document.getElementById('nav_catalog_btn').style.visibility = 'hidden';
        document.getElementById('nav_wishlist_btn').style.visibility = 'hidden';
        document.getElementById('nav_profile_btn').style.visibility = 'hidden';
        document.getElementById('nav_logout_btn').style.visibility = 'hidden';
    }
});

// bed icon function
nav_bed_btn.addEventListener("click", () => {
    if (isManager == -1) {
        location.replace('welcome-page.html'); // redirect a disconnected user to the home page
    } else {
        location.replace('home-page.html'); // redirect a connected user to the home page
    }
});

// function to send user to right profile page
nav_profile_btn.addEventListener("click", () => {
    if (isManager == 0) {
        location.replace('#'); // redirect a disconnected user to the home page
    } else {
        location.replace('profile.html'); // redirect a connected user to the home page
    }
});

// log out function