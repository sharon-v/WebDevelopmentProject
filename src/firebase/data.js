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
var prod = database.collection('products');
var customers = database.collection('customers');
var manager = database.collection('manager');
var fbAuth = firebase.auth();
export { fbAuth as fbAuth };
export { prod as dbProducts };
export { customers as dbCustomers };
export { manager as dbManager };