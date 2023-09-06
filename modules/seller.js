const express = require('express');
const router = express.Router();
const { dummyCatList } = require('../dummyData.js');
const { formatCurrencyVND } = require('../helperFuncs.js');
const productDb = require('../models/function_product.js');
const { SELLER_ROUTE } = require('../constants.js');

let root = `.${SELLER_ROUTE}`

// full route to product-detail page: /product/seller/:seller_id
router.get(`${SELLER_ROUTE}/:seller_id`, async (req, res) => {
    try {
        let renderedSellerProduct = await productDb.from_seller(req.params.seller_id);
        const sellerDisplayName = renderedSellerProduct.sellerDisplayName;
        const sellerUsername = renderedSellerProduct.sellerUsername;
        const productList = renderedSellerProduct.productList;
        res.render('layout.ejs', {
            title: "Seller",
            bodyFile: `${root}/seller`,
            formatCurrencyVND: formatCurrencyVND,
            // TODO: add real data - categoryList
            categoryList: dummyCatList,
            userSession: req?.session?.user,
            productList: productList,
            sellerDisplayName: sellerDisplayName,
            sellerUsername: sellerUsername,
        });
    }
    catch (err) {
        res.send("Cannot fetch product by seller with id " + req.params.seller_id);
        // res.send(err);
    }
}); 
module.exports = router;