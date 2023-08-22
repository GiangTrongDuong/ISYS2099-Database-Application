const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://eeet2099group2:eeet2099Pass@databaseapplicationproj.fexqmnq.mongodb.net/?retryWrites=true&w=majority";
async function connect(){
  try{
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

connect();

require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Modules
const user = require('./modules/user');
const product = require('./modules/product');
const cart = require('./modules/cart');
const order = require('./modules/order');
const others = require('./modules/others');
const { default: mongoose } = require('mongoose');

app.use('/', user)
app.use('/', product)
app.use('/my-cart', cart)
app.use('/order', order)
app.use('/', others)


// full route to Home page: /
app.get("/", function (req, res) {
  res.render('home/index')
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});

