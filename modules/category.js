const express = require('express');
const router = express.Router();
const Category = require('../models/mongodb/models/function_category');
const { CATEGORY_ROUTE } = require('../constants');
const ProductDb = require('../models/function_product');
const { formatCurrencyVND } = require('../helperFuncs');

let root = './category/'; //root folder to pages

router.get(`${CATEGORY_ROUTE}`, async (req, res) => {
    try {
        const catlist = await Category.getAllCats();
        res.render("layout.ejs", {
            title: "Category List",
            bodyFile: `${root}/categories.ejs`,
            // TODO: add real data - categoryList
            categoryList: catlist,
            userSession: req?.session?.user,
        });
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});
router.get(`${CATEGORY_ROUTE}/:id`, async (req, res) => {
    try {
        const catlist = await Category.getAllCats();
        const id = req.params.id;
        /* TODO: rendered real category, include:
            Child categories
            Products */
        const renderedCategory = await Category.findCatById(id);
        // get products from category
        const productList = await ProductDb.from_category(id);
        console.log(category);
        // convert to object to assign attribute
        let category = {
            ...renderedCategory,
            products: productList
        }
        // const category = renderedCategory.toObject();
        res.json(category);

        // res.render("layout.ejs", {
        //     title: "Category",
        //     bodyFile: `${root}/category.ejs`,
        //     // TODO: add real data - categoryList
        //     categoryList: catlist,
        //     userSession: req?.session?.user,
        //     // TODO: add real data - category
        //     category: category,
        // });
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

module.exports = router;