const express = require('express'); 
const { ABOUT_ROUTE, PRIVACY_ROUTE, CONTACT_ROUTE, MEMBERS } = require('../constants');
const Category = require('../models/mongodb/models/function_category');
const router = express.Router(); 
const isAuth = require('../models/isAuth');

let root = './others/'; //root folder to pages

//session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET","POST"],
  credentials: true
}));

//end-of session

router.get(`${ABOUT_ROUTE}`, async function(req, res) { 
  const catlist = await Category.getAllCats(6);
  res.render("layout.ejs", {
    title: "About Us",
    bodyFile: `${root}/about`,
    // TODO: add real data - categoryList
    categoryList: catlist,
    userSession: req?.session?.user,
    members: MEMBERS,

  });
}); 

router.get(`${PRIVACY_ROUTE}`, async function(req, res) { 
  const catlist = await Category.getAllCats(6);
  res.render("layout.ejs", {
    title: "Privacy Policy",
    bodyFile: `${root}/policy`,
    // TODO: add real data - categoryList
    categoryList: catlist,
    userSession: req?.session?.user,
  }); 
}); 

router.get(`${CONTACT_ROUTE}`, async function(req, res) { 
  const catlist = await Category.getAllCats(6);
  res.render("layout.ejs", {
    title: "Contact Us",
    bodyFile: `${root}/contact`,
    // TODO: add real data - categoryList
    categoryList: catlist,
    userSession: req?.session?.user,
    members: MEMBERS,
  }); 
}); 

module.exports = router;