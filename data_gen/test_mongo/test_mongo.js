require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mg = require('../models/methods');
const {sendResponse} = require('../middleware/middleware');

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mg.connectMongoDB()

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.get("/category/get-all-children/:id", async (req, res) => {
  
  try {
    const id = req.params.id;
    const result = await mg.getAllChildren(id);
    if (result) sendResponse(res, 200, `ok`, result);
    else sendResponse(res, 404, `No category with id ${id} is found`, null);

  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

app.post("/category", async (req, res) => {
  try {
    const {_id, name, attribute, parent_category} = req.body;
    const result = await mg.saveCat(_id, name, attribute, parent_category);
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

app.get("/category", async (req, res) => {
  try {
    const result = await mg.getAllCats();
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

app.delete("/category/delete-cat-only/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await mg.deleteCat(id);
    if (result) sendResponse(res, 200, `Transaction succeeded. Category is deleted.`);
    else sendResponse(res, 500, `Transaction failed. Category is not deleted.`);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});

app.delete("/category/delete-cat-and-children/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await mg.deleteCatAndChildren(id);
    if (result.length != 0) sendResponse(res, 200, `Category and its children are deleted.`, result);
    if (result.length == 0) sendResponse(res, 404, `No category with ID ${id} is found.`, result);
    else sendResponse(res, 500, `Transaction failed. Category and its children are not deleted.`);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

