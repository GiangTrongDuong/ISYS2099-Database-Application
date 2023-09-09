const express = require('express');
const router = express.Router();
const Category = require('../models/mongodb/models/category');
const { CATEGORY_ROUTE } = require('../constants');
const { dummyCatList, dummyClothingProducts } = require('../dummyData');
const { formatCurrencyVND } = require('../helperFuncs');

let root = './category/'; //root folder to pages

router.get(`${CATEGORY_ROUTE}`, async (req, res) => {
    try {
        // let categories = await Category.find({}).limit(50).exec();
        res.render("layout.ejs", {
            title: "Category List",
            bodyFile: `${root}/categories.ejs`,
            // TODO: add real data - categoryList
            categoryList: dummyCatList,
            userSession: req?.session?.user,
        });
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});
router.get(`${CATEGORY_ROUTE}/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        /* TODO: rendered real category, include:
            Child categories
            Products */
        // const renderedCategory = await Category.findById(id).exec();
        const renderedCategory = dummyCatList.find((category) => category.id == id);
        renderedCategory.products = dummyClothingProducts;
        renderedCategory.childCategories = dummyCatList.filter((category) => category["parent_category_id"] == id);

        res.render("layout.ejs", {
            title: "Category",
            bodyFile: `${root}/category.ejs`,
            // TODO: add real data - categoryList
            categoryList: dummyCatList,
            userSession: req?.session?.user,
            // TODO: add real data - category
            category: renderedCategory,
        });
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

module.exports = router;