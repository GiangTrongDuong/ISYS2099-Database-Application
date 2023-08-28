const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { CATEGORY_ROUTE } = require('../constants');
const { dummyCatList, dummyProductCatList } = require('../dummyData');
const { formatCurrencyVND } = require('../helperFuncs');

let root = './category/'; //root folder to pages

router.get(`${CATEGORY_ROUTE}`, async (req, res) => {
    try {
        let categories = await Category.find({}).limit(50).exec();
        // res.status(200).send(categories);
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});
router.get(`${CATEGORY_ROUTE}/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        /* TODO: rendered real category, include:
            Breadcumb (Home > Category > ...)
            Child categories
            Products */
        // const renderedCategory = await Category.findById(id).exec();
        const renderedCategory = dummyCatList.find((category) => category.id == id);
        renderedCategory.products = dummyProductCatList;
        renderedCategory.childCategories = dummyCatList.filter((category) => category["parent_category_id"] == id);

        res.render("layout.ejs", {
            title: "Category",
            bodyFile: `${root}/category.ejs`,
            formatCurrencyVND: formatCurrencyVND,
            category: renderedCategory,
            // TODO: add real data - categoryList
            categoryList: dummyCatList
        });
        // res.status(200).send(renderedCategory);
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

module.exports = router;