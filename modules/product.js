const express = require('express');
const router = express.Router();
const Category = require('../models/mongodb/models/function_category');
const { formatCurrencyVND, formatDate } = require('../helperFuncs.js');
const { PRODUCT_ROUTE, ATTRIBUTES } = require('../constants.js');
const db = require('../models/function_product.js');
const productDbMongo = require('../models/mongodb/models/function_product_mongodb');
const sqlString = require('sqlstring');

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

// Show products containing keywords
router.get(`${PRODUCT_ROUTE}/search`, async (req, res) => {
  try {
    const catlist = await Category.getAllCats();
    const word = req.query.searchContent;

    const onlyWord = sqlString.escape(word).replace('\'', '').replace('\'', '');
    const productList = await db.contain_word(onlyWord);
    // res.json({ "Products": productList });
    res.render('layout.ejs', {
      title: "Products",
      bodyFile: `${root}/product-all`,
      categoryList: catlist,
      userSession: req?.session?.user,
      productList: productList,
      productAttributes: ATTRIBUTES,
    });
  }
  catch (err) {
    // res.send({
    //   // message: "Error retrieving categories",
    //   error: err.message ?? "Error retrieving data"
    // });
    console.log(err);
  }
});

// get all products
// router.get(`${PRODUCT_ROUTE}`, async (req, res) => {
//   try {
//     console.log("Called Product Router");
//     const catlist = await Category.getAllCats();
//     const productList = await db.all();
//     res.render('layout.ejs', {
//       title: "Products",
//       bodyFile: `${root}/product-all`,
//       categoryList: catlist,
//       userSession: req?.session?.user,
//       productList: productList,
//       productAttributes: ATTRIBUTES,
//     });
//     // res.json(productList);
//   } catch (err) {
//     console.log(err);
//     res.send({
//       // message: "Error retrieving categories",
//       error: err.message ?? "Error retrieving data"
//     });
//   }
// });

// filter products by attribute
router.get(`${PRODUCT_ROUTE}`, async (req, res) => {
  try {
    const catlist = await Category.getAllCats();
    const { category, ...attributeList } = req.query;

    // {categoryId, attributes: [{name, value}]}
    const attributes = [];
    for (let aName in attributeList) {
      // Iterate over each array of values for the given attribute name
      // if value is not array
      if (!Array.isArray(attributeList[aName])) {
        attributes.push({
          aName: aName,
          value: attributeList[aName]
        });
      }
      else {
        for (let value of attributeList[aName]) {
          attributes.push({
            aName: aName,
            value: value
          });
        }
      }
    }

    const newFilter = {
      category: category,
      attribute: attributes
    };
    const result = await productDbMongo.filterProducts(newFilter.category, newFilter.attribute);
    const ids = result.map(product => {
      return product.mysql_id;
    })
    const productList = await db.from_ids(ids);


    // res.json(result);
    res.render('layout.ejs', {
      title: "Products",
      bodyFile: `${root}/product-all`,
      categoryList: catlist,
      userSession: req?.session?.user,
      productList: productList,
      productAttributes: ATTRIBUTES,
    });

  }
  catch (err) {
    res.send("Cannot fetch item " + err);
  }
});

// full route to product-detail page: /product/:id
router.get(`${PRODUCT_ROUTE}/:id`, async (req, res) => {
  try {
    // get product
    const catlist = await Category.getAllCats(6);
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

module.exports = router;