const express = require('express'); 
const router = express.Router(); 

var root = '/user'; //root folder to pages

// full route to login page: /login
router.get('/login', function(req, res) {
  res.render(root + 'login')
}); 

// full route to signup page: /signup
router.get('/signup', function(req, res) { 
  res.render(root + 'signup'); 
}); 

// full route to my-account page: /my-account
router.get('/my-account', function(req, res) { 
  const user  = null; //store info to display 
  res.render(root + 'my_account', {user: user}); 
}); 

module.exports = router;