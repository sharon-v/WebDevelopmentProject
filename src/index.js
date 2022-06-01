import bodyParser from 'body-parser';
import express from 'express';
import { json, urlencoded } from 'express';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

// ** start guide
import morgan from 'morgan';
import { Router } from 'express';
// ** end guide

const port = process.env.PORT || 5000;
const app = express();
// app.use(Router); // line doesn't work

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + '/'));
// app.use('/public', express.static('/'));

// ** start guide
app.use(morgan('dev'));

app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
// ** end guide

// original
app.get('/', (req, res) => {
  // res.send('<h1>The web is on the air<h1>');
  res.sendFile('/components/welcome-page.html', { root: __dirname });
});

// test
// app.get('/', (req, res) => {
//   // res.send('<h1>The web is on the air<h1>');
//   res.sendFile(__dirname + '/src/components/welcome-page.html');
// });

app.listen(port, () => {
  console.log('server is up and running - checking');
});

// ** start guide
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
// ** end guide


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
