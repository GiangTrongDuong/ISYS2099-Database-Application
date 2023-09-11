const express = require('express');
const path = require('path');
const cors = require('cors');

//session and parser
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const { navigatePage, formatCurrencyVND } = require('./helperFuncs.js');
const { PORT } = require('./constants.js');
require('dotenv').config();
const app = express();
const { connectMongoDB } = require('./models/connection/mongodbConnect');
const Category = require('./models/mongodb/models/function_category');
const ProductDb = require('./models/function_product');

connectMongoDB()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Use body-parser middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET", "POST"],
  credentials: true
}));

app.use(cookieParser());
app.use(session({
  key: "username",
  secret: "Group2",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
  },
}));

// to apply css styles
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


// reusable function for all ejs
app.locals.navigatePage = navigatePage;
app.locals.formatCurrencyVND = formatCurrencyVND;

// Modules
const user = require('./modules/user');
const product = require('./modules/product');
const cart = require('./modules/cart');
const order = require('./modules/order');
const others = require('./modules/others');
const category = require('./modules/category');
const seller = require('./modules/seller');
const warehouse = require('./modules/warehouse');

app.use('/', user)
app.use('/', product)
app.use('/', cart)
app.use('/order', order)
app.use('/', others)
app.use('/', category)
app.use('/', seller)
app.use('/', warehouse);

// full route to Home page: /
app.get("/", async (req, res) => {
  try {
    const catlist = await Category.getAllCats();
    let productList = [];
    let currentCategoryIndex = 0;

    while (productList.length < 1 && currentCategoryIndex < catlist.length) {
      productList = await ProductDb.get_from_a_category(catlist[currentCategoryIndex].id);
      if (productList.length === 0) {
        currentCategoryIndex++;
      }
    }

    const categoryProductList = [
      {
        content: catlist[currentCategoryIndex],
        products: productList
      },
    ];

    // console.log("Category", catlist[currentCategoryIndex]);
    // console.log("Category Product List", categoryProductList);
    res.render('layout.ejs', {
      title: "Home",
      bodyFile: "home/index.ejs",
      categoryList: catlist,
      categoryProductList: categoryProductList,
      userSession: req?.session?.user
    });
  } catch (err) {
    res.send({
      message: "Error retrieving categories",
      error: err.message ?? "Error retrieving data"
    });
  }
});


app.listen(PORT, function () {
  console.log("Server started on port 3000");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
})

