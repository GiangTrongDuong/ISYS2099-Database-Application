const express = require('express');
const { ORDER_ROUTE, ORDER_HISTORY_ROUTE } = require('../constants');
const Category = require('../models/mongodb/models/function_category');
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
  //   categoryList: catlist,
  //   order: order
  // });
});

// full route to order-history page: /order/history
// router.get(`${ORDER_HISTORY_ROUTE}`, function (req, res) { //og
router.get(`${ORDER_HISTORY_ROUTE}`, async (req, res) => { //add user id to test
  try{
    const info = req.session.user;
    const id = info.id;
    const orders = await db.get_orders(id);
    const catlist = await Category.getAllCats();
    res.render("layout.ejs", {
      title: "Order History",
      bodyFile: `${root}/order_history`,
      // TODO: add real data - categoryList
      categoryList: catlist,
      orders: orders,
      id: id,
      userSession: req.session.user,
    });
  }
  catch (err) {
    res.send("Cannot fetch orders from uid: " + req.params.id + " with error: " + err);
  }
});

// updating order works
router.get(`/order_update`, async (req, res) => {
  try{
    const message = await db.update_status(106, "Accepted");
    res.json(message);
    // res.render("layout.ejs", {
    //   title: "Order Detail",
    //   bodyFile: `${root}/order_detail`,
    //   // TODO: add real data - categoryList
    //   categoryList: catlist,
    //   order: order,
    //   order_id: req.params.id
    // });
  }
  catch (err) {
    res.send("Status update error: " + err);
  }
});

// full route to order-detail page: /order/order/:id
router.get(`${ORDER_ROUTE}/:id`, async (req, res) => {
  try{
    const {order_items, total_price} = await db.get_order_item(req.params.id);
    res.json({"order_items": order_items, "total_price": total_price});
    // res.render("layout.ejs", {
    //   title: "Order Detail",
    //   bodyFile: `${root}/order_detail`,
    //   // TODO: add real data - categoryList
    //   categoryList: catlist,
    //   order: order,
    //   order_id: req.params.id
    // });
  }
  catch (err) {
    res.send("Cannot fetch items from oid: " + req.params.oid);
  }
});



module.exports = router;