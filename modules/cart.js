const express = require('express'); 
const { CART_ROUTE } = require('../constants');
const router = express.Router(); 

let root = `.${CART_ROUTE}`

// full route to cart page: /my-cart
router.get(`${CART_ROUTE}`, function(req, res) { 
  const cartItems = null; //store info to display 
  res.render(`${root}/cart`, {cartItems: cartItems});
});

module.exports = router;