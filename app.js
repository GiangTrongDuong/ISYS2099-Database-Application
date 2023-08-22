const express = require('express');
const path = require('path');
const { navigatePage, formatCurrencyVND } = require('./helperFuncs.js');
const { dummyCatList, dummyProduct } = require('./dummyData.js');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// to apply css styles
app.use(express.static('public'));

// reusable function for all ejs
app.locals.navigatePage = navigatePage;

// Modules
const user = require('./modules/user');
const product = require('./modules/product');
const cart = require('./modules/cart');
const order = require('./modules/order');
const others = require('./modules/others');

app.use('/', user)
app.use('/', product)
app.use('/my-cart', cart)
app.use('/order', order)
app.use('/', others)


// full route to Home page: /
app.get("/", function (req, res) {
    res.render('home/index', {
        // TODO: add real data
        categoryList: dummyCatList,
    })
});

// full route to Product page: /product
app.get("/product", function (req, res) {
    const productId = req.query.id;
    // TODO: get product data from database using id
    //....
    res.render(`product/product`, {
        formatCurrencyVND: formatCurrencyVND,
        // TODO: add real data
        product: dummyProduct,
    })
});

app.listen(port, function () {
    console.log("Server started on port 3000");
});

