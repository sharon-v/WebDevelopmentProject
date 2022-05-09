// Your web app's Firebase configuration
export const state = {
    firebaseConfig: {
        apiKey: 'AIzaSyAlk5hRiLNudNrTepVbfSd5ClZVZEip2LA',
        authDomain: 'holysheetsweb.firebaseapp.com',
        projectId: 'holysheetsweb',
        storageBucket: 'holysheetsweb.appspot.com',
        messagingSenderId: '440529465617',
        appId: '1:440529465617:web:9be0d40688f07151849cb0',
        measurementId: 'G-MS9HPT4M16',
    },
};


firebase.initializeApp(state.firebaseConfig);

// Set database variable
var database = firebase.firestore();
var dbProducts = database.collection('products');
var dbCustomers = database.collection('customers');
var dbManager = database.collection('manager');
var dbDeveloperPasscode = database.collection('developerPasscode');
var dbOrders = database.collection('orders');
var dbShoppingCart = database.collection('shoppingCart');
var dbOrdersTimes = database.collection('ordersTimes');
var dbWishList = database.collection('wishList');

var storageRef = firebase.storage().ref();
var fbAuth = firebase.auth();

export {
    fbAuth,
    dbProducts,
    dbCustomers,
    dbManager,
    dbDeveloperPasscode,
    dbOrders,
    dbshoppingCart,
    dbWishList,
    dbOrdersTimes,
    storageRef,
};