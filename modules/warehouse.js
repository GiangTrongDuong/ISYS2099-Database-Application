const express = require('express');
const { WAREHOUSE_ROUTE, WAREHOUSE_ID_ROUTE, WAREHOUSE_BY_UID_ROUTE, WAREHOUSE_MOVE_PRODUCT } = require('../constants');
const { dummyCatList } = require('../dummyData');
const router = express.Router();

let root = `.${WAREHOUSE_ROUTE}`;

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

// TODO: route to interface for create/update; process create/delete/update a warehouse


// view a single warehouse
//full route: /warehouse/view?id=123
router.get(`${WAREHOUSE_ID_ROUTE}`, function (req, res) {
  const cartItems = null; //store info to display 
  res.render("layout.ejs", {
    title: "My Cart",
    bodyFile: `${root}/cart`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
    userSession: req?.session?.user,
    // TODO: add real data
    cartItems: cartItems,
  });
});

// view all warehouse item for a warehouse admin
//full route: /warehouse/by?uid=123
router.get(`${WAREHOUSE_BY_UID_ROUTE}`, function (req, res) {
    const cartItems = null; //store info to display 
    res.render("layout.ejs", {
        title: "My Cart",
        bodyFile: `${root}/cart`,
        // TODO: add real data - categoryList
        categoryList: dummyCatList,
        userSession: req?.session?.user,
        // TODO: add real data
        cartItems: cartItems,
    });
});

// route to interface to move products from 1 warehouse to another
// full route: /warehouse/move?product=123&quantity=456
router.get(`${WAREHOUSE_MOVE_PRODUCT}`, function (req, res) {
    const cartItems = null; //store info to display 
    res.render("layout.ejs", {
      title: "My Cart",
      bodyFile: `${root}/cart`,
      // TODO: add real data - categoryList
      categoryList: dummyCatList,
      userSession: req?.session?.user,
      // TODO: add real data
      cartItems: cartItems,
    });
  });

// route to process move product

module.exports = router;