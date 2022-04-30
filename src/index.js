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
app.use(Router);
app.use(express.static(__dirname + '/'));

// **** start guide
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
// **** end guide


app.get('/', (req, res) => {
  // res.send('<h1>The web is on the air<h1>');
  res.sendFile('/new pages/Welcome-page.html', { root: __dirname });
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


const mongoAtlasUri = 'mongodb+srv://chen-admin:123@cluster0.xjbqx.mongodb.net/Holy_Sheets?retryWrites=true&w=majority'; // mongoDB connection

app.use(bodyParser.urlencoded({ extended: true, limit: '1m' }));
app.use(bodyParser.json());

try { // Connect to the MongoDB cluster
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Mongoose is connected'),
  );
  const dbConnection = mongoose.connection;
  dbConnection.on('error', (err) => {
    console.error(err);
  });
  dbConnection.once('open', () => console.log('Connected to DB!'));
} catch (e) {
  console.log('could not connect');
}
