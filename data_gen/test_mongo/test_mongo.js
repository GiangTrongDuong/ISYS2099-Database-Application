require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mg_category = require('../models/function_category');
const mg_product = require('../models/function_product_mongodb');
const {connectMongoDB} = require('../models/mongodbConnect')

const {sendResponse} = require('../middleware/middleware');

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectMongoDB()

// get attributes (from itself and its parents) of a category
app.get("/category/all-attributes/:catid", async (req, res) => {
  try {
    const result = await mg_category.getAttributesOfCategory(req.params.catid);
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

// get attribute and all values group by attribute's name
app.get("/attribute_group", async (req, res) => {
  try {
    const result = await mg_product.getAttributeGroups();
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//create new category
app.post("/product", async (req, res) => {
  try {
    const {mysql_id, category, attribute} = req.body;
    const result = await mg_product.saveProduct(mysql_id, category, attribute);
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//update a category
app.post("/product/update", async (req, res) => {
  try {
    const {mysql_id, category, attribute} = req.body;
    const result = await mg_product.updateProduct(mysql_id, category, attribute);
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//get products by attribute name and value
//return list of products
app.get("/product/filter_by_attribute", async (req, res) => {
  try {
    const {aName, value} = req.body;
    const result = await mg_product.findProductsByAttribute(aName, value);
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//get products by attribute name and value
//return list of products
app.get("/product/filter_by_attributes", async (req, res) => {
  try {
    const attributes = req.body;
    const result = await mg_product.findProductsByAttributes(attributes);
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

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


//delete a product by mysql id
app.delete("/product/:mysqlid", async (req, res) => {
  try {
    const mysqlid = req.params.mysqlid;
    const result = await mg_product.deleteProductByMysqlId(mysqlid);
    if (result) sendResponse(res, 200, `Deleted product`, result);
    else sendResponse(res, 500, `Delete failed`);
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

// this route is to update a category (only when that category & its children dont have any product)
app.post("/category/update", async (req, res) => {
  try {
    const {_id, name, attribute, parent_category} = req.body;
    const result = await mg_category.updateCat(id, name, attribute, parent_category)
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

//get all categories
app.get("/category", async (req, res) => {
  try {
    const result = await mg_category.getAllCats(6);
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

