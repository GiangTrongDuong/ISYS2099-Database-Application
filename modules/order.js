const express = require('express');
const { ORDER_ROUTE, ORDER_HISTORY_ROUTE } = require('../constants');
const { dummyCatList } = require('../dummyData');
const db = require('../models/function_order');
const router = express.Router();

let root = `.${ORDER_ROUTE}`;

// full route to order page: /order/order
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
// router.get(`${ORDER_HISTORY_ROUTE}`, function (req, res) { //og
router.get(`${ORDER_HISTORY_ROUTE}/:uid`, async (req, res) => { //add user id to test
  try{
    const orders = await db.get_orders(req.params.uid);
    res.render("layout.ejs", {
      title: "Order History",
      bodyFile: `${root}/order_history`,
      // TODO: add real data - categoryList
      categoryList: dummyCatList,
      orders: orders,
      uid: req.params.uid
    });
  }
  catch (err) {
    res.send("Cannot fetch orders from uid: " + req.params.uid + " with error: " + err);
  }
});

// full route to order-detail page: /order/order/:id
router.get(`${ORDER_ROUTE}/:id`, async (req, res) => {
  try{
    const order = await db.get_order_item(req.params.id);
    res.render("layout.ejs", {
      title: "Order Detail",
      bodyFile: `${root}/order_detail`,
      // TODO: add real data - categoryList
      categoryList: dummyCatList,
      order: order,
      order_id: req.params.id
    });
  }
  catch (err) {
    res.send("Cannot fetch items from oid: " + req.params.oid);
  }
});


module.exports = router;