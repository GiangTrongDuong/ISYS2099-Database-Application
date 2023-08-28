const express = require('express');
const { LOGIN_ROUTE, SIGNUP_ROUTE, MY_ACCOUNT_ROUTE } = require('../constants');
const { dummyCatList } = require('../dummyData');
const router = express.Router();

var root = './user'; //root folder to pages

// full route to login page: /login
router.get(`${LOGIN_ROUTE}`, function (req, res) {
  res.render("layout.ejs", {
    title: "Login",
    bodyFile: `${root}/login`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
  })
});

// full route to signup page: /signup
router.get(`${SIGNUP_ROUTE}`, function (req, res) {
  res.render("layout.ejs", {
    title: "Signup",
    bodyFile: `${root}/signup`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
  });
});

// full route to my-account page: /my-account
router.get(`${MY_ACCOUNT_ROUTE}`, function (req, res) {
  const user = null; //store info to display 
  res.render("layout.ejs", {
    title: "My Account",
    bodyFile: `${root}/my_account`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
    user: user
  });
});

module.exports = router;