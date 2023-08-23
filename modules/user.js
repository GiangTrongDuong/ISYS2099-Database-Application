const express = require('express'); 
const { LOGIN_ROUTE, SIGNUP_ROUTE, MY_ACCOUNT_ROUTE } = require('../constants');
const router = express.Router(); 

var root = './user'; //root folder to pages

// full route to login page: /login
router.get(`${LOGIN_ROUTE}`, function(req, res) {
  res.render(root + 'login')
}); 

// full route to signup page: /signup
router.get(`${SIGNUP_ROUTE}`, function(req, res) { 
  res.render(root + 'signup'); 
}); 

// full route to my-account page: /my-account
router.get(`${MY_ACCOUNT_ROUTE}`, function(req, res) { 
  const user  = null; //store info to display 
  res.render(root + 'my_account', {user: user}); 
}); 

module.exports = router;