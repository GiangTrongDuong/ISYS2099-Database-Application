const express = require('express'); 
const router = express.Router(); 

var root = './cart/'; //root folder to pages

// full route to cart page: /my-cart
router.get('/', function(req, res) { 
  const cartItems = null; //store info to display 
  res.render(root + 'cart', {cartItems: cartItems});
});

module.exports = router;