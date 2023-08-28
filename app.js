const express = require('express');
const path = require('path');
const { navigatePage, formatCurrencyVND } = require('./helperFuncs.js');
const { CONNECTED_URI, PORT } = require('./constants.js');
const { dummyCatList, dummyProductCatList } = require('./dummyData.js');
require('dotenv').config();
const app = express();
const { default: mongoose } = require('mongoose');


async function connect(){
  try{
    await mongoose.connect(CONNECTED_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// to apply css styles
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


// reusable function for all ejs
app.locals.navigatePage = navigatePage;

// Modules
const user = require('./modules/user');
const product = require('./modules/product');
const cart = require('./modules/cart');
const order = require('./modules/order');
const others = require('./modules/others');
const category = require('./modules/category');

app.use('/', user)
app.use('/', product)
app.use('/my-cart', cart)
app.use('/order', order)
app.use('/', others)
app.use('/', category)


// full route to Home page: /
app.get("/", function (req, res) {
    res.render('layout.ejs', {
        title: "Home",
        bodyFile: "./home/index.ejs",
        formatCurrencyVND: formatCurrencyVND,
        // TODO: add real data
        categoryList: dummyCatList,
        // TODO: add real data
        // render 3 categories
        // render products from database for 3 categories
        categoryProductList: dummyProductCatList,
    })
});


app.listen(PORT, function () {
    console.log("Server started on port 3000");
});

