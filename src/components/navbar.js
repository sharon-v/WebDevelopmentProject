import { fbAuth } from '../firebase/data.js';

// spreads navbar to all the pages
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
    console.log('inside user if');
    // check if manager

    // check if customer

    var uid = user.uid;
    // ...
  } else {
    console.log('inside user else');
    // User is signed out
    document.getElementById('nav_home_btn').style.visibility = 'hidden';
    document.getElementById('nav_catalog_btn').style.visibility = 'hidden';
    document.getElementById('nav_cart_and_badge').style.visibility = 'hidden';
    document.getElementById('nav_wishlist_btn').style.visibility = 'hidden';
    document.getElementById('nav_profile_btn').style.visibility = 'hidden';
    document.getElementById('nav_logout_btn').style.visibility = 'hidden';
  }
});
