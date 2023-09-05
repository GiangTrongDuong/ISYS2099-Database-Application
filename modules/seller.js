const express = require('express'); 
const router = express.Router(); 
const { dummyCatList } = require('../dummyData.js');
const { formatCurrencyVND, formatDate } = require('../helperFuncs.js');
const { PRODUCT_ROUTE } = require('../constants.js');
const productDb = require('../models/function_product.js');
const 