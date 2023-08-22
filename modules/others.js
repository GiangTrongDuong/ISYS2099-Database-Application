const express = require('express'); 
const router = express.Router(); 

var root = 'others/'; //root folder to pages

router.get('/about-us', function(req, res) { 
  res.render(root + 'about');
}); 

router.get('/privacy-policy', function(req, res) { 
  res.render(root + 'policy'); 
}); 

router.get('/contact-us', function(req, res) { 
  res.render(root + 'contact'); 
}); 

module.exports = router;