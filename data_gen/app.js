const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const dataRead = require('./read_data');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


// full route to Home page: /
app.get("/", function (req, res) {
  res.render('home/index')
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});

app.use('./database', dataRead);
