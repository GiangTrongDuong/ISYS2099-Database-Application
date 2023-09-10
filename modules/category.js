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
        const catlist = await Category.getAllCats(6);
        const id = req.params.id;
        // get category
        const renderedCategory = await Category.findCatById(id);

        // get all children
        const renderedChildrenResult = await Category.getAllChildrenAndName(id);

        // get products from category
        const productList = await ProductDb.from_category(id);
        console.log("Category: ", renderedCategory);

        // convert to object to assign attribute
        res.render("layout.ejs", {
            title: "Category",
            bodyFile: `${root}/category.ejs`,
            // TODO: add real data - categoryList
            categoryList: catlist,
            userSession: req?.session?.user,
            // TODO: add real data - category
            category: renderedCategory,
            childCategories: renderedChildrenResult,
            productList: productList,
        });
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

// create category
router.post(`${CATEGORY_ROUTE}`, async (req, res) => {
    try {
        const newCat = req.body;
        const createdCat = await Category.saveCat(null, newCat.name, newCat.attribute, newCat.parent_category);
        // res.redirect(`${CATEGORY_ROUTE}`);
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

// update category
router.put(`${CATEGORY_ROUTE}/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        const newCat = req.body;
        const updatedCat = await Category.updateCat(id, newCat.name, newCat.attribute, newCat.parent_category);
        // res.redirect(`${CATEGORY_ROUTE}`);
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

// delete category
router.delete(`${CATEGORY_ROUTE}/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        const deletedCat = await Category.deleteCat(id);
        // res.redirect(`${CATEGORY_ROUTE}`);
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

module.exports = router;