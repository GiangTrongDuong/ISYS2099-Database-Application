const express = require('express');
const router = express.Router();
const Category = require('../models/mongodb/models/function_category');
const { formatCurrencyVND, formatDate } = require('../helperFuncs.js');
const { PRODUCT_ROUTE } = require('../constants.js');
const db = require('../models/function_product.js');
const productDbMongo = require('../models/mongodb/models/function_product_mongodb');

let root = `.${PRODUCT_ROUTE}`

//session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET", "POST"],
  credentials: true
}));
//end-of session

// get all products
// router.get(`${PRODUCT_ROUTE}/all`, async (req, res) => {
//   try{
//     const product_list = await db.all();
//     console.log("get all products", product_list);
//     const product_list_mongo = await productDbMongo.getAllProducts();
//     console.log("get all products mongo", product_list_mongo);
//     res.json({"Products": product_list, "ProductsMongo": product_list_mongo});
//   } catch (err) {
//     res.send("Cannot fetch all products");
//   }
// });

// full route to product-detail page: /product/:id
router.get(`${PRODUCT_ROUTE}/:id`, async (req, res) => {
  try {
    // get product
    const catlist = await Category.getAllCats();
    const result = await db.from_id(req.params['id']); //store info to display 
    const product = result[0];
    const productMongo = await productDbMongo.findProductByMysqlID(req.params['id']);
    // combine productMongo with product
    product.attribute = productMongo.attribute;
    res.render('layout.ejs', {
      title: "Product",
      bodyFile: `${root}/product`,
      // TODO: add real data - categoryList
      categoryList: catlist,
      userSession: req?.session?.user,
      product: product,
      formatDate: formatDate
    });
  }
  catch (err) {
    res.json(err);
  }
});

// filter products by attribute
router.get(`${PRODUCT_ROUTE}/filter`, async (req, res) => {
  try {
    // render category
    const catlist = await Category.getAllCats();
    const aName = req.query.aName;
    const value = req.query.value;
    const result = await productDbMongo.findProductsByAttribute(aName, value);

    // TODO:
    res.json(result);

    res.render('layout.ejs', {
      title: "Product",
      bodyFile: `${root}/product`,
    });
  }
  catch (err) {
    res.send("Cannot fetch item with id " + req.params.id);
  }
});

// Show products containing keywords
router.get(`${PRODUCT_ROUTE}/search/:words`, async (req, res) => {
  try {
    const product_list = await db.contain_word(req.params.words);
    res.json({ "Products": product_list });
    // res.render('layout.ejs', {
    //     title: "Product",
    //     bodyFile: `${root}/product`,
    //     // TODO: add real data - categoryList
    //     categoryList: catlist,
    //     product_list: product_list
    // });
  }
  catch (err) {
    res.send("Cannot fetch item with id " + req.params.id);
  }
});

module.exports = router;