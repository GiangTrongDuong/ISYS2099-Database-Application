const express = require('express');
const router = express.Router();
const Category = require('../models/category');

let root = './others/'; //root folder to pages

router.get("/", async (req, res) => {
    try {
        let categories = await Category.find({}).limit(50).exec();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving categories", error: error.message });
    }
});

module.exports = router;