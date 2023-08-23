const express = require('express');
const { ORDER_ROUTE, ORDER_HISTORY_ROUTE } = require('../constants');
const { dummyCatList } = require('../dummyData');
const router = express.Router();

let root = `.${ORDER_ROUTE}`;

// full route to order page: /order
router.get(`${ORDER_ROUTE}`, function (req, res) {
  const order = null; //store info to display 
  res.render("layout.ejs", {
    title: "Place Order",
    bodyFile: `${root}/place_order`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
    order: order
  });
});

// full route to order-history page: /order/history
router.get(`${ORDER_HISTORY_ROUTE}`, function (req, res) {
  const orders = null; //store info to display 
  res.render("layout.ejs", {
    title: "Order History",
    bodyFile: `${root}/order_history`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
    orders: order_history
  });
});

// full route to order-detail page: /order/:id
router.get(`${ORDER_ROUTE}/:id`, function (req, res) {
  const order = null; //store info to display 
  res.render("layout.ejs", {
    title: "Order Detail",
    bodyFile: `${root}/order_detail`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
    order: order
  });
});


module.exports = router;