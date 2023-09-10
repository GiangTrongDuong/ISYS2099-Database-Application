const express = require('express');
const router = express.Router();
const Category = require('../models/mongodb/models/function_category');
const { CATEGORY_ROUTE, WAREHOUSE_ROUTE } = require('../constants');
const ProductDb = require('../models/function_product');
const { formatCurrencyVND, getCurrentTimeString, getRandomColor, isColorDark } = require('../helperFuncs');

let root = './category/'; //root folder to pages

router.get(`${CATEGORY_ROUTE}`, async (req, res) => {
    try {
        const catlist = await Category.getAllCats();
        res.render("layout.ejs", {
            title: "Category List",
            bodyFile: `${root}/categories.ejs`,
            categoryList: catlist,
            userSession: req?.session?.user,
            getRandomColor: getRandomColor,
            isColorDark: isColorDark,
        });
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

router.get(`${WAREHOUSE_ROUTE}/categories`, async (req, res) => {
    try {
        const catlist = await Category.getAllCats();
        // console.log("Categories", catlist);
        res.render("layout.ejs", {
            title: "Warehouse Category List",
            bodyFile: `${root}/warehouse_category.ejs`,
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
        // res.json(catlist)
        // get category
        const renderedCategory = await Category.findCatById(id);
        console.log("Rendered", renderedCategory);

        // get all children
        const renderedChildrenResult = await Category.getAllChildrenAndName(id);
        console.log("Children", renderedChildrenResult);

        // get products from category
        const productList = await ProductDb.get_from_a_category(id);
        console.log("Products", productList);

        // convert to object to assign attribute
        res.render("layout.ejs", {
            title: "Category",
            bodyFile: `${root}/category.ejs`,
            getRandomColor: getRandomColor,
            isColorDark: isColorDark,
            categoryList: catlist,
            userSession: req?.session?.user,
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
        // console.log("CreatedCat", newCat);
        const createdCat = await Category.saveCat(null, newCat.name, newCat.attribute, newCat.parent_category);
        res.redirect(`${WAREHOUSE_ROUTE}/categories`);
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});
// delete category
router.post(`${CATEGORY_ROUTE}/delete`, async (req, res) => {
    try {
        const id = req.body.id;
        // console.log("ID to delete", id);
        // const deletedCat = await Category.deleteCat(id);
        const deletedCat = await Category.deleteCatAndChildren(id);
        res.redirect(`${WAREHOUSE_ROUTE}/categories`);
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

// update category
router.post(`${CATEGORY_ROUTE}/update/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        const newCat = req.body;
        const updatedCat = await Category.updateCat(id, newCat.name, newCat.attribute, newCat.parent_category);
        console.log("UPdated", updatedCat);
        res.redirect(`${WAREHOUSE_ROUTE}/categories`);
    } catch (error) {
        // res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

module.exports = router;