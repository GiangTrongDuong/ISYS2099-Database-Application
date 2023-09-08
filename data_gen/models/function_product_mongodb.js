const mongoose = require("mongoose");
const {product} = require('./product');
const mg_category = require('./function_category');
const ObjectId = mongoose.Types.ObjectId;

//delete all categories in db
const dropAll = async () =>{
  await product.deleteMany({});
}

// create a category
const saveProduct = async(mysqlid, categoryid) => {
  try {
      var newProduct = new product;
      newProduct.mysql_id = mysqlid;
      newProduct.category = ObjectId(categoryid);
      let saved = await newProduct.save();

      saved = await initAttributesForProduct(newProduct)
      console.log("=== Product " + newProduct.mysql_id + " saved to DB.");
      return saved;
  }
  catch (error) {
      console.log("Product save error: " + error);
  }
}

//get all products in db
const getAllProducts = async() => {
  try {
      const all = await product.find();
      return all
  }
  catch (err) {
      console.error('Get all products failed: ', err)
  }
}

// findByAttribute() takes a pair of attribute name & value, then return a list of category has that attribute
const findProductsByAttribute = async(aName, value) => {
  try {
      //find all cats that have aName = aName & aValue = value
      const products = await product.find({attribute: {$elemMatch: {aName: aName, value: value}}})
      return products
  }
  catch (err) {
      console.log("Find by attribute error: " + err);
  }
}

// find a cat by id
const findProductByMysqlD = async(mysqlid) => {
  try {
      const product = await product.findOne({mysql_id: mysqlid});
      return product;
  } catch (err) {
      console.log("Failed to find category by id: ", err);
  }
}

// add parent's attribute to current object's attribute
// the data is structured nicely so we only need to go up 1 level
const initAttributesForProduct = async (newProduct) => {
  try{
      const cat = await mg_category.findCatById(newProduct.category)
      let updated = null;
      updated = await addAttributesToProduct(newProduct, cat.attribute)

      const findParents = await mg_category.getAllParents(newProduct.category)
      if (!isEmpty(findParents.parent_categories)) { // if have parents
        for (pid of findParents.parent_categories) {
          let parent = await mg_category.findCatById(pid);
          if (parent.attribute) { // if parent has attribute
            updated = await addAttributesToProduct(newProduct, parent.attribute)
          }
        }
      }
      return updated;
  }
  catch (err){
      console.log("Cannot add attribute " + err);
  }
}


const addAttributesToProduct = async (myProduct, newAttributes) => {
  try {
      // if attributes list is not empty
      if (!isEmpty(newAttributes)) {
          const updated = await product.findOneAndUpdate(
                  {_id : myProduct._id},
                  { $addToSet: { attribute: { $each: newAttributes }}},
                  { returnOriginal: false }
              );
          return updated
      }

      return myProduct
  } catch (err) {
      console.log(err)
  }
}

const getAttributeGroups = async () => {
  try {
      const result = await product.aggregate([
          {
              $unwind: '$attribute'
          },
          {
              $group: {
                  "_id": "$attribute.aName",
                  "values": {
                      "$addToSet": "$attribute.value"
                  }
              }
          },
          {
              $project: {
                  _id: 0,
                  "aName": "$_id",
                  "values": 1,
              }
          },
      ])
      return result
  } catch (err) {
      console.log(err)
      throw (err)
  }
}


// check if an object is empty
function isEmpty(o){
  return (o === undefined || o == null || o == "" || o.length ==0);
}

module.exports = {saveProduct, getAllProducts, dropAll, findProductsByAttribute, getAttributeGroups}