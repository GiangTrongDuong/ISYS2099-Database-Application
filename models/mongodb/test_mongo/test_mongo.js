require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mg_category = require('../models/function_category');
const mg_product = require('../models/function_product_mongodb');
const {connectMongoDB} = require('../../connection/mongodbConnect')

const {sendResponse} = require('../../../helperFuncs');

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectMongoDB()

//get all products
app.get("/product", async (req, res) => {
  try {
    const result = await mg_product.getAllProducts();
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//get all of children (and below) of a category
app.get("/category/get-all-children/:id", async (req, res) => {  
  try {
    const id = req.params.id;
    const result = await mg_category.getAllChildren(id);
    if (result) sendResponse(res, 200, `ok`, result);
    else sendResponse(res, 404, `No category with id ${id} is found`, null);

  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//get all of children (and below) of a category
app.get("/category/get-parents/:id", async (req, res) => {
  
  try {
    const id = req.params.id;
    const result = await mg_category.getAllParents(id);
    if (result) sendResponse(res, 200, `ok`, result);
    else sendResponse(res, 404, `No category with id ${id} is found`, null);

  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//create new category
app.post("/category", async (req, res) => {
  try {
    const {_id, name, attribute, parent_category} = req.body;
    const result = await mg_category.saveCat(_id, name, attribute, parent_category);
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//get all categories
app.get("/category", async (req, res) => {
  try {
    const result = await mg_category.getAllCats();
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//get all lowest level categories
app.get("/category/lowestlevel", async (req, res) => {
  try {
    const result = await mg_category.getLowestLevelCats();
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//delete a category and all of its children (and below)
// (only when that category & its children dont have any product)
app.delete("/category/delete-cat-and-children/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await mg_category.deleteCatAndChildren(id);
    if (result.length != 0) sendResponse(res, 200, `Category and its children are deleted.`, result);
    if (result.length == 0) sendResponse(res, 404, `No category with ID ${id} is found.`, result);
    else sendResponse(res, 500, `Transaction failed. Category and its children are not deleted.`);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//delete a category, then set parent_category of its direct children to null
// (only when that category & its children dont have any product)
app.delete("/category/delete-cat-only/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await mg_category.deleteCat(id);
    if (result) sendResponse(res, 200, `Transaction succeeded. Category is deleted.`);
    else sendResponse(res, 500, `Transaction failed. Category is not deleted.`);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});


// this route is to update a category (only when that category & its children dont have any product)
app.post("/category/update/:id", async (req, res) => {
  try {
    const id = req.params.id
    const {name, attribute, parent_category} = req.body;
    const result = await mg_category.updateCat(id, name, attribute, parent_category)
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

app.get("/product/attribute", async (req, res) => {
  try {
    const result = await mg_product.getAttributeGroups();
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

