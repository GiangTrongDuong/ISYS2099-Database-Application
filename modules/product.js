const express = require('express'); 
const router = express.Router(); 
const Category = require('../models/mongodb/models/function_category');
const { formatCurrencyVND, formatDate } = require('../helperFuncs.js');
const { PRODUCT_ROUTE } = require('../constants.js');
const db = require('../models/function_product.js');

let root = `.${PRODUCT_ROUTE}`

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

// full route to product-detail page: /product/:id
router.get(`${PRODUCT_ROUTE}/:id`, async (req, res) => { 
  try{
    // get product
    const catlist = await Category.getAllCats();
    const product = await db.from_id(req.params['id']); //store info to display 
    res.render('layout.ejs', {
        title: "Product",
        bodyFile: `${root}/product`,
        // TODO: add real data - categoryList
        categoryList: catlist,
        userSession: req?.session?.user,
        product: product[0],
        formatDate: formatDate
    });
  }
  catch (err){
    res.send("Cannot fetch product with id " + req.params.id);
  }
}); 

// File to show products in a list of categories
router.get(`${PRODUCT_ROUTE}/cat/:categories`, async (req, res) => { 
  try{
    const product_list = await db.from_category(req.params.categories);
    res.json({"Products": product_list});
    // res.render('layout.ejs', {
    //     title: "Product",
    //     bodyFile: `${root}/product`,
    //     // TODO: add real data - categoryList
    //     categoryList: catlist,
    //     product_list: product_list
    // });
  }
  catch (err){
    res.send("Cannot fetch item with id " + req.params.id);
  }
}); 

// Show products containing keywords
router.get(`${PRODUCT_ROUTE}/search/:words`, async (req, res) => { 
  try{
    const product_list = await db.contain_word(req.params.words);
    res.json({"Products": product_list});
    // res.render('layout.ejs', {
    //     title: "Product",
    //     bodyFile: `${root}/product`,
    //     // TODO: add real data - categoryList
    //     categoryList: catlist,
    //     product_list: product_list
    // });
  }
  catch (err){
    res.send("Cannot fetch item with id " + req.params.id);
  }
}); 

module.exports = router;