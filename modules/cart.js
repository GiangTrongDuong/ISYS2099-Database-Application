const express = require('express');
const { CART_ROUTE } = require('../constants');
const { dummyCatList } = require('../dummyData');
const db = require('../models/function_cart');
const router = express.Router();
const isAuth = require("../models/isAuth");

// let root = `.${CART_ROUTE}`
let root = './cart';

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

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//end-of session

// full route to cart page: /my-cart
router.get(`${CART_ROUTE}`, async (req, res) => {
  try{
    const info = req.session.user;
  const id = info.id;
  const cartItems = await db.getCartItem(id); //store info to display
  res.render("layout.ejs",{
    title: "Cart",
    userSession: req?.user?.session,
    bodyFile:`${root}/carttest`,
    cartItems: cartItems,
    categoryList: dummyCatList,
  }
  );
  } catch (err){
    res.send("Cannot fetch carts item! with" + err);
  }
});

router.post(`/deletecart`, async (req, res) => {
  try{
    const info = req.session.user;
    const id = info.id;

  } catch (err){
    res.send ("Error fetching data!" + err); 
  }
});

router.post(`/increasecart`, async (req, res) => {
  try{
    const info = req.session.user;
    const id = info.id;

  } catch (err){
    res.send ("Error fetching data!" + err); 
  }
});

router.post(`/decreasecart`, async (req, res) => {
  try{
    const info = req.session.user;
    const id = info.id;

  } catch (err){
    res.send ("Error fetching data!" + err); 
  }
});

module.exports = router;