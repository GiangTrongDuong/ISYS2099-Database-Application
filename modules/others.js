const express = require('express'); 
const { ABOUT_ROUTE, PRIVACY_ROUTE, CONTACT_ROUTE } = require('../constants');
const router = express.Router(); 

let root = './others/'; //root folder to pages

router.get(`${ABOUT_ROUTE}`, function(req, res) { 
  res.render(root + 'about');
}); 

router.get(`${PRIVACY_ROUTE}`, function(req, res) { 
  res.render(root + 'policy'); 
}); 

router.get(`${CONTACT_ROUTE}`, function(req, res) { 
  res.render(root + 'contact'); 
}); 

module.exports = router;