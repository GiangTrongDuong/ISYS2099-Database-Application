require('dotenv').config(); 
const mg_product = require('./models/function_product_mongodb');
const {connectMongoDB} = require('./models/mongodbConnect')
const product_json_fn = './product_mongo_list.json';
const fs = require('fs');

const importProduct = async () => {
  fs.readFile(product_json_fn, 'utf-8', async (readErr, data) => {
      try {
          await mg_product.dropAll();
          if (readErr) {
              console.log("Error reading file: " + readErr);
              return;
          }
          const json_data = JSON.parse(data);
          for (product of json_data) {
            await mg_product.saveProduct(product.mysql_id, product.category, product.attribute)
          }
          console.log('Product Import Success')
          process.exit()
      } catch (error) {
          console.error('Error with product import', error)
          process.exit(1)
      }
  })
}

connectMongoDB();
importProduct();
