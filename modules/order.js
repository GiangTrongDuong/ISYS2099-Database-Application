const express = require('express');
const { ORDER_ROUTE, ORDER_HISTORY_ROUTE } = require('../constants');
const { dummyCatList } = require('../dummyData');
const db = require('../models/function_order');
const router = express.Router();

let root = `.${ORDER_ROUTE}`;

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

// full route to order page: /order/order
//TODO: turn this into POST
// place an order
router.get(`${ORDER_ROUTE}/`, async (req, res) => {
  // const order = JSON.parse(req.params.product_quantity_list); //store info to display 
  const order = [{"pid": 1, "quantity": 10}, {"pid": 2, "quantity":4}];
  const message = await db.place_order(1,order);
  res.json(message);
  console.log(message);
  // res.render("layout.ejs", {
  //   title: "Place Order",
  //   bodyFile: `${root}/place_order`,
  //   // TODO: add real data - categoryList
  //   categoryList: dummyCatList,
  //   order: order
  // });
});

// view all orders for a customer
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

// update order status: /order_status (old: /order/status)
//TODO: post order_id, 
router.get(`${ORDER_ROUTE}_status/`, async (req, res) => { // change to post
  try{
    // const order_id = req.query.id;
    console.log("Status");
    // const newStatus = req.query.newStatus;
    const order_id = 95;
    const newStatus = 'Accepted';
    const message = await db.update_status(order_id, newStatus);
    res.json(message);
    // res.render("layout.ejs", {
    //   title: "Order Detail",
    //   bodyFile: `${root}/order_detail`,
    //   // TODO: add real data - categoryList
    //   categoryList: dummyCatList,
    //   order: order,
    //   order_id: req.params.id
    // });
  }
  catch (err) {
    res.send("Cannot fetch items from oid: " + req.params.oid);
  }
});

// view info about a single order
// full route to order-detail page: /order/:id
router.get(`${ORDER_ROUTE}/:id`, async (req, res) => {
  try{
    console.log("id");
    const {order_items, total_price} = await db.get_order_item(req.params.id);
    res.json({"order_items": order_items, "total_price": total_price});
    // res.render("layout.ejs", {
    //   title: "Order Detail",
    //   bodyFile: `${root}/order_detail`,
    //   // TODO: add real data - categoryList
    //   categoryList: dummyCatList,
    //   order: order,
    //   order_id: req.params.id
    // });
  }
  catch (err) {
    res.send("Cannot fetch items from oid: " + req.params.oid);
  }
});

module.exports = router;