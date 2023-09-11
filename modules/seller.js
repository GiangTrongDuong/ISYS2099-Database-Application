const express = require('express');
const router = express.Router();
const Category = require('../models/mongodb/models/function_category');
const { formatCurrencyVND } = require('../helperFuncs.js');
const productDb = require('../models/function_product.js');
const productMongoP = require('../models/mongodb/models/function_product_mongodb');
const productMongo = require('../models/mongodb/models/function_category');
const { SELLER_ROUTE, MY_ACCOUNT_ROUTE } = require('../constants.js');
const isAuth = require('../models/isAuth.js');

let root = `.${SELLER_ROUTE}`

// full route to product-detail page: /product/seller/:seller_id
router.get(`${SELLER_ROUTE}/:seller_id`, async (req, res) => {
    try {
        let renderedSellerProduct = await productDb.from_seller(req.params.seller_id);
        const sellerDisplayName = renderedSellerProduct.sellerDisplayName;
        const sellerUsername = renderedSellerProduct.sellerUsername;
        const productList = renderedSellerProduct.productList;
        const catlist = await Category.getAllCats(6);
        res.render('layout.ejs', {
            title: "Seller",
            bodyFile: `${root}/seller`,
            // TODO: add real data - categoryList
            categoryList: catlist,
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

router.get(`${MY_ACCOUNT_ROUTE}/my-product`, isAuth.isAuth, async (req, res) => {
    try{
        const info = req?.session?.user;
        const id = info.id;
        let renderedSellerProduct = await productDb.from_seller(id);
        const catlist = await Category.getLowestLevelCats();
        const productList = renderedSellerProduct.productList;
        res.render('layout.ejs',{
            title: "My Product List",
            bodyFile: `${root}/seller_product`,
            categoryList: catlist,
            userSession: req?.session?.user,
            productList: productList
        })
    }catch (err){
        res.send(err);
    }
})

router.post(`${MY_ACCOUNT_ROUTE}/update-stock`, isAuth.isAuth, async (req,res) => {
    const id = req.body.id;
    const quantity = req.body.quantity;
    try{
    await productDb.insert_to_warehouse(id, quantity);
    res.redirect(`${MY_ACCOUNT_ROUTE}/my-product`);
    }catch(err){
        res.send(err);
    }
    
})

router.post(`${MY_ACCOUNT_ROUTE}/create-product`, isAuth.isAuth, async (req,res) => {
    try{
    const info = req?.session?.user;
    const id = info.id;
    const title = req.body.title;
    const price = req.body.price;
    const desc = req.body.description;
    const cat = req.body.category;
    const length = req.body.len;
    const width = req.body.wid;
    const height = req.body.hei;
    const image = req.body.image;
    const remaining = req.body.stock;
    productDb
    const pid = await productDb.createProduct(title,id,price,desc,cat,length,width,height,image,remaining);
    res.redirect(`${MY_ACCOUNT_ROUTE}/select-attribute/${cat}/${pid}`);
    }catch (err){
    res.send(err);
    }
})

router.get(`${MY_ACCOUNT_ROUTE}/select-attribute/:cat/:id`, async (req,res) => {
    const pid = req.params.id;
    const catID = req.params.cat;
    const catlist = await Category.getAllCats(6);
    const attribute = await productMongo.getAttributesOfCategory(catID);
    // res.json(attribute);
    res.render('layout.ejs',{
        title: "My Product List",
        bodyFile: `${root}/selectAttSeller`,
        categoryList: catlist,
        userSession: req?.session?.user,
        attList: attribute,
        catID: catID,
        productID: pid, 
    })
})

router.post(`${MY_ACCOUNT_ROUTE}/select-attribute/submit-att-select`, async (req,res)=>{
    const cid = req.body.cid;
    const pid = req.body.pid;
    const aName = req.body.aName;
    const value = req.body.value;
    var i;
    var newCatValue = [];
    if (typeof aName == "string" || aName instanceof String){
        newCatValue.push({aName: aName, value: value});
    } else {
        for(i= 0; i<aName.length; i++){
            newCatValue.push({aName: aName[i], value: value[i]});
        }
    }
    const message = await productMongoP.saveProduct(pid,cid,newCatValue);
    res.redirect(`${MY_ACCOUNT_ROUTE}/my-product`);
})

router.post(`${MY_ACCOUNT_ROUTE}/update-product`, isAuth.isAuth, async (req, res)=>{
    try{
    const pid = req.body.id;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    console.log(pid + title + price);
    await productDb.updateDetails(pid,title,price,description);
    res.redirect(`${MY_ACCOUNT_ROUTE}/my-product`);
    }catch (err){
        res.send(err);
        console.log("err" + err);
    }
})

router.post(`${MY_ACCOUNT_ROUTE}/delete-product`, isAuth.isAuth, async (req, res)=>{
    try{
    const pid = req.body.id;
    await productMongoP.deleteProductByMysqlId(pid);
    await productDb.deleteProduct(pid);
    res.redirect(`${MY_ACCOUNT_ROUTE}/my-product`);
    }catch (err){
        res.send(err);
    }
})
module.exports = router;