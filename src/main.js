const express = require('express');
const port = process.env.PORT || 5000;
const app = express();


app.get('/',(req, res)=>{
    res.send('<h1>The web is on the air<h1>');
})

app.listen(port, ()=>{
    console.log('server is up and runing- cheacking');
})