const express = require('express'); 
const router = express.Router(); 

var root = './order/'; //root folder to pages

// full route to order page: /order
router.get('/', function(req, res) { 
  const order = null; //store info to display 
  res.render(root + 'place_order', {order: order});
}); 

// full route to order-history page: /order/history
router.get('/history', function(req, res) { 
  const orders = null; //store info to display 
  res.render(root + 'order_history', {orders: order_history});
}); 

// full route to order-detail page: /order/:id
router.get('/:id', function(req, res) { 
  const order = null; //store info to display 
  res.render(root + 'order_detail', {order_id: req.params.id});
}); 


module.exports = router;