const express = require('express');
const { CART_ROUTE } = require('../constants');
const { dummyCatList } = require('../dummyData');
const router = express.Router();

let root = `.${CART_ROUTE}`

//session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET","POST"],
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//end-of session

// full route to cart page: /my-cart
router.get(`${CART_ROUTE}`, function (req, res) {
  const cartItems = null; //store info to display 
  res.render("layout.ejs", {
    title: "My Cart",
    bodyFile: `${root}/cart`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
    // TODO: add real data
    cartItems: cartItems,
  });
});

module.exports = router;