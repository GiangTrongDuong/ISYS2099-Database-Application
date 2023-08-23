const express = require('express'); 
const { ABOUT_ROUTE, PRIVACY_ROUTE, CONTACT_ROUTE } = require('../constants');
const { dummyCatList } = require('../dummyData');
const router = express.Router(); 

let root = './others/'; //root folder to pages

router.get(`${ABOUT_ROUTE}`, function(req, res) { 
  res.render("layout.ejs", {
    title: "About Us",
    bodyFile: `${root}/about`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
  });
}); 

router.get(`${PRIVACY_ROUTE}`, function(req, res) { 
  res.render("layout.ejs", {
    title: "Privacy Policy",
    bodyFile: `${root}/policy`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
  }); 
}); 

router.get(`${CONTACT_ROUTE}`, function(req, res) { 
  res.render("layout.ejs", {
    title: "Contact Us",
    bodyFile: `${root}/contact`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
  }); 
}); 

module.exports = router;