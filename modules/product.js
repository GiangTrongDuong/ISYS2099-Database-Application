const express = require('express'); 
const router = express.Router(); 

// var root = '/product'; //root folder to pages
var root = './product/';

// full route to product-detail page: /product/:id
router.get('/product/:id', function(req, res) { 
  const product = null; //store info to display 
  res.render(root + 'product', {product: product});
}); 

module.exports = router;