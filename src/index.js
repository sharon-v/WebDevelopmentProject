// for mongoDB
// const {MongoClient} =require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const express = require('express');

// **** start guide
const morgan = require('morgan');
const { Router } = require('express');
// **** end guide

const port = process.env.PORT || 5000;
const app = express();
// app.use(Router); // line doesn't work
app.use(express.static(__dirname + '/'));

// **** start guide
app.use(morgan('dev'));

app.use(express.json());
app.use(
  express.urlencoded({
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
// **** end guide

app.get('/', (req, res) => {
  // res.send('<h1>The web is on the air<h1>');
  res.sendFile('/components/welcome-page.html', { root: __dirname });
});

app.listen(port, () => {
  console.log('server is up and runing- checking');
});

// **** start guide
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
// **** end guide