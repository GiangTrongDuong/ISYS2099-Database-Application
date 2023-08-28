const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const dataRead = require('./test_read_sql/read_data');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/read', dataRead);

// full route to Home page: /
// Currently there's nothing here; go to /read to see all data
app.get("/", function (req, res) {
  res.render('home/index', {error: false, title: "Home"});
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});

app.use('./database', dataRead);
