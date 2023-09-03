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
    sendResponse(res, 200, `ok`, result);
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

