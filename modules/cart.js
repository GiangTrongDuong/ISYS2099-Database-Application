const express = require('express');
const { CART_ROUTE } = require('../constants');
const Category = require('../models/mongodb/models/function_category');
const db = require('../models/function_cart');
const dorder = require('../models/function_order');
const router = express.Router();
const isAuth = require("../models/isAuth");

// let root = `.${CART_ROUTE}`
let root = './cart';

//session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const { formatCurrencyVND } = require('../helperFuncs');

router.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET", "POST"],
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//end-of session

// full route to cart page: /my-cart
router.get(`${CART_ROUTE}`, async (req, res) => {
  try {
    const info = req?.session?.user;
    const id = info.id;
    const renderedCart = await db.getCartItem(id); //store info to display 
    const cartItems = renderedCart.items;
    const totalPrice = renderedCart.total;
    const catlist = await Category.getAllCats(6);
    // console.log(cartItems);
    res.render("layout.ejs", {
      title: "Cart",
      bodyFile: `${root}/cart`,
      userSession: info,
      // TODO: add real data - categoryList
      categoryList: catlist,
      cartItems: cartItems,
      totalPrice: totalPrice,
    }
    );
  } catch (err) {
    res.send("Cannot fetch carts item! with" + err);
  }
});

// add to cart
router.post(`${CART_ROUTE}/add-cart/:pid`, async (req, res) => {
  try {
    const info = req.session.user;
    const id = info.id;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    // call function to delete cart item
    await db.addToCart(id, productId, quantity); //store info to display 
    res.redirect(`${CART_ROUTE}`);
  } catch (err) {
    res.send("Error fetching data!" + err);
  }
});

// delete product from cart
router.post(`${CART_ROUTE}/delete-cart/:pid`, async (req, res) => {
  try {
    const info = req.session.user;
    const id = info.id;
    const productId = req.params.pid;
    // call function to delete cart item
    await db.removeCartItem(id, productId); //store info to display 
    res.redirect(`${CART_ROUTE}`);
  } catch (err) {
    res.send("Error fetching data!" + err);
  }
});

// change quantity of product in cart
router.post(`${CART_ROUTE}/change-cart/:pid`, async (req, res) => {
  try {
    const info = req.session.user;
    const id = info.id;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    // call function to increase quantity
    const results = await db.changeQuantity(id, productId, quantity); //store info to display 
    res.redirect(`${CART_ROUTE}`);
    // res.json({ status: "success", updatedQuantity: quantity });

  } catch (err) {
    res.send("Error fetching data!" + err);
  }
});

router.post(`${CART_ROUTE}/increase-cart/:pid`, async (req, res) => {
  try {
    const info = req.session.user;
    const id = info.id;
    const productId = req.params.pid;
    // call function to increase quantity
    await db.increaseQuantity(id, productId); //store info to display 
    res.redirect(`${CART_ROUTE}`);
    // res.json({ status: "success", updatedQuantity: quantity });
  } catch (err) {
    res.send("Error fetching data!" + err);
  }
});

router.post(`${CART_ROUTE}/decrease-cart/:pid`, async (req, res) => {
  try {
    const info = req.session.user;
    const id = info.id;
    const productId = req.params.pid;
    // call function to decrease quantity
    await db.decreaseQuantity(id, productId); //store info to display 
    res.redirect(`${CART_ROUTE}`);
    // res.json({ status: "success", updatedQuantity: quantity });
  } catch (err) {
    res.send("Error fetching data!" + err);
  }
});

// place order with the items in the cart
router.get(`${CART_ROUTE}/place-order`, async (req, res) => {
  // const order = JSON.parse(req.params.product_quantity_list); //store info to display 
  try{
    const message = await db.place_order(req.session.user.id);
    res.json(message);
    console.log(message);
  }
  catch(err){
    res.json(err);
  }
  
  // res.render("layout.ejs", {
  //   title: "Place Order",
  //   bodyFile: `${root}/place_order`,
  //   // TODO: add real data - categoryList
  //   categoryList: dummyCatList,
  //   order: order
  // });
});
module.exports = router;