import express from 'express'

// var express = require("express")

// var app = express()
// app.use(express.static('public'))
// app.all("/data", function(req, res) {
// })
// app.listen(8080)
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
})
