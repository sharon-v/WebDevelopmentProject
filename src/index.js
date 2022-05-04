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
  console.log('server is up and runing- checking');
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