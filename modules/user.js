const express = require('express');
const { LOGIN_ROUTE, SIGNUP_ROUTE, MY_ACCOUNT_ROUTE } = require('../constants');
const { dummyCatList } = require('../dummyData');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require("../models/user_authentication");
var root = './user'; //root folder to pages

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// full route to login page: /login
router.get(`${LOGIN_ROUTE}`, function (req, res) {
  res.render("layout.ejs", {
    title: "Login",
    bodyFile: `${root}/login`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
  })
});

router.post(`${LOGIN_ROUTE}`, async function (req, res) {
  try{
    console.log(req.body);
    const result = await db.login(req.body.username,req.body.password);
    console.log(result);
    
  }catch (err){
    
  }
  
})

// full route to signup page: /signup
router.get(`${SIGNUP_ROUTE}`, function (req, res) {
  res.render("layout.ejs", {
    title: "Signup",
    bodyFile: `${root}/signup`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
  });
});

router.post(`${SIGNUP_ROUTE}`, async function (req,res){
  const result = await db.signUp(req.body.account, req.body.username, req.body.displayName, req.body.details, req.body.password)
  
})

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