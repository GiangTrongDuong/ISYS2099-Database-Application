const mysql = require('mysql2');
require('dotenv').config(); 
const mg_category = require('./models/function_category');
const mg_product = require('./models/function_product_mongodb');
const {connectMongoDB} = require('./models/mongodbConnect')
const database = require('./models/dbSqlConnect');

connectMongoDB();

const getAllProducts = async () => {
  return new Promise ((resolve, reject) => {
    database.query(`SELECT * FROM product`, 
    (error, results) => {
        if (error) reject(error);
        else resolve(results);
    })
  })
}

const importProduct = async () => {
  try {
    await mg_product.dropAll();
    products = await getAllProducts();
    for (product of products) {
      await mg_product.saveProduct(product.id, product.category)
    }
  } catch (error) {
    console.error('Error with product import', error)
  }
}

importProduct();
