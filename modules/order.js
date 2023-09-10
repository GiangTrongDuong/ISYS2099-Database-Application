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
  method: ["GET", "POST"],
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//end-of session  

// full route to order-history page: /order/history
// router.get(`${ORDER_HISTORY_ROUTE}`, function (req, res) { //og
router.get(`${ORDER_HISTORY_ROUTE}`, async (req, res) => { //add user id to test
  try {
    const info = req.session.user;
    const id = info.id;
    const orders = await db.get_orders(id);
    const catlist = await Category.getAllCats(6);
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
router.post(`/order_update`, async (req, res) => {
  try {
    const status = req.body.status;
    const id = req.body.id;
    // console.log("Update", status, id);
    const message = await db.update_status(id, status);
    res.redirect(`/order${ORDER_ROUTE}/${id}`);
    // const message = await db.update_status(106, "Accepted");
    // res.json(message);
  }
  catch (err) {
    res.send("Status update error: " + err);
  }
});

// full route to order-detail page: /order/order/:id
router.get(`${ORDER_ROUTE}/:id`, async (req, res) => {
  try {
    const catlist = await Category.getAllCats(6);
    const orderId = req.params.id;
    const {order_items, order} = await db.get_order_item(orderId);
    // console.log("ORder", order_items, "Total", order);

    // res.json(result);
    res.render("layout.ejs", {
      title: "Order Details",
      bodyFile: `${root}/order_detail.ejs`,
      // TODO: add real data - categoryList
      categoryList: catlist,
      orderItems: order_items,
      order: order,
      userSession: req.session.user,
    });
  }
  catch (err) {
    console.log(err);
    res.send(err);
  }
});



module.exports = router;