const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
app.use(express.static(__dirname + '/'));


app.get('/', (req, res)=>{
  // res.send('<h1>The web is on the air<h1>');
  res.sendFile('/new pages/Welcome-page.html', {root: __dirname});
});

app.listen(port, ()=>{
  console.log('server is up and runing- checking');
});
