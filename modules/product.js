const express = require('express'); 
const router = express.Router(); 
const { dummyProduct, dummyCatList, dummyParentCatIds } = require('../dummyData.js');
const { formatCurrencyVND } = require('../helperFuncs.js');
const { PRODUCT_ROUTE } = require('../constants.js');

let root = `.${PRODUCT_ROUTE}`

// full route to product-detail page: /product/:id
router.get(`${PRODUCT_ROUTE}/:id`, function(req, res) { 
  const productId = req.params.id;
  // TODO: get product data from database using id
  const product = null; //store info to display 

  res.render('layout.ejs', {
      title: "Product",
      bodyFile: `${root}/product`,
      formatCurrencyVND: formatCurrencyVND,
      // TODO: add real data - categoryList
      categoryList: dummyCatList,
      // TODO: add real data
      // TODO: add parenCategoryIds to product
      product: dummyProduct,
      // TODO: add real data - parent categories of current product's category
      parentCategoryIds: dummyParentCatIds
  })
}); 

module.exports = router;