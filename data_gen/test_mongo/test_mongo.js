require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mg = require('../models/methods');
const {sendResponse} = require('../middleware/middleware');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mg.connectMongoDB()

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.get("/category/get-all-childern/:id", async (req, res) => {
  
  try {
    const id = req.params.id;
    const result = await mg.getAllChildren(id);
    sendResponse(res, 200, `ok`, result);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

