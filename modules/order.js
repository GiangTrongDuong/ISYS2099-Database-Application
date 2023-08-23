const express = require('express');
const { ORDER_ROUTE, ORDER_HISTORY_ROUTE } = require('../constants');
const router = express.Router();

let root = `.${ORDER_ROUTE}`;

// full route to order page: /order
router.get(`${ORDER_ROUTE}`, function (req, res) {
  const order = null; //store info to display 
  res.render(`${root}/place_order`, { order: order });
});

// full route to order-history page: /order/history
router.get(`${ORDER_HISTORY_ROUTE}`, function (req, res) {
  const orders = null; //store info to display 
  res.render(`${root}/order_history`, { orders: order_history });
});

// full route to order-detail page: /order/:id
router.get(`${ORDER_ROUTE}/:id`, function (req, res) {
  const order = null; //store info to display 
  res.render(`${root}/order_detail`, { order: order });
});


module.exports = router;