const mongoose = require("mongoose");
const {product} = require('./product');
const mg_category = require('./function_category');
const ObjectId = mongoose.Types.ObjectId;

//delete all categories in db
const dropAll = async () =>{
  await product.deleteMany({});
}

const deleteProductByMysqlId = async(mysqlid) => {
  try {
    const delelted = await product.findOneAndDelete({mysql_id: mysqlid});
    if (delelted == null) throw new Error(`No product with id = ${mysqlid}`)
    return delelted;
  }
  catch (err) {
    throw(err)
  }

}

/* create a product
  - input: mysqlid, categoryid, attributes
  - attributes is a array of pair {aName, value} to set
  - example of attribute list:
  [
    {
      "aName": "Warranty",
      "value": "3 months"
    },
    {
      "aName": "Color",
      "value": "Blue"
    }
  ]
  - note: please put attributes to an array as above (even if you only set 1 attribute)
*/
const saveProduct = async(mysqlid, categoryid, attributes) => {
  try {
      let exist = await mysqlIDExist(mysqlid);
      if (exist) throw new Error("Product already exists");
      var newProduct = new product;
      newProduct.mysql_id = mysqlid;
      newProduct.category = ObjectId(categoryid);
      let saved = await newProduct.save();

      saved = await initAttributesForProduct(newProduct)
      saved = await setAttributes(newProduct._id, attributes)
      console.log("=== Product " + newProduct.mysql_id + " saved to DB.");
      return saved;
  }
  catch (error) {
    if (error.name === "ValidationError") {
      await product.findOneAndDelete({_id: newProduct._id})
      throw new Error("Product is not created because of validation failure. Suggestiton: check if product's attribute is valid.")
    }
    throw(error)
  }
}


// update a product: same input as saveProduct
const updateProduct = async(mysqlid, categoryid, attributes) => {
  try {
      let prod = await findProductByMysqlID(mysqlid);
      if (prod.category != categoryid && !isEmpty(categoryid)) {
        prod.category = ObjectId(categoryid);
        prod = await prod.save();
        prod = await initAttributesForProduct(prod)
      }
      prod = await setAttributes(prod._id, attributes)
      return saved;
  }
  catch (error) {
    if (error.name === "ValidationError") {
      throw new Error("Product is not updated because of validation failure. Suggestiton: check if product's attribute is valid.")
    }
    throw(error)
  }
}

//get all products in db
const getAllProducts = async() => {
  try {
    const all = await product.find();
    return all
  }
  catch (err) {
    throw(err)
  }
}

// findProductsByAttribute() takes a pair of attribute aname & value, then return a list of products having that attribute
const findProductsByAttribute = async(aName, value) => {
  try {
      //find all products that have aName = aName & aValue = value
      const products = await product.find({attribute: {$elemMatch: {aName: aName, value: value}}})
      return products
  }
  catch (err) {
    throw(err)
  }
}

// find a prodcut by mongodb id
const findProductByID = async(id) => {
  try {
    const myproduct = await product.findOne({_id: id});
    return myproduct;
  } catch (err) {
    console.log("Failed to find category by id: ", err);
  }
}

// find a prodcut by mysql id
const findProductByMysqlID = async(mysqlid) => {
  try {
    const myproduct = await product.findOne({mysql_id: mysqlid});
    return myproduct;
  } catch (err) {
    console.log("Failed to find category by id: ", err);
  }
}

// initialize attribute list for product
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

// addAttributesToProduct() set attributes for product
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
      throw(err)
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
              "values":  {
                $filter: {
                  input: "$values",
                  as: "value",
                  cond: {
                    $ne: [
                      "$$value",
                      null
                    ]
                  },
                },
              }
            }
          },
      ])
      return result
  } catch (err) {
      console.log(err)
      throw (err)
  }
}

const setAttributes = async (productid, attribute_name_value_list) => {
  try {
    const myproduct = await findProductByID(productid);
    let update_attribute = myproduct.attribute;
    if (!isEmpty(update_attribute) && !isEmpty(attribute_name_value_list)) {
      for (a_pair of attribute_name_value_list) {
        for (let i = 0; i < update_attribute.length; i++) {
          if (update_attribute[i].aName.toLowerCase() == a_pair.aName.toLowerCase()) {
            if (typeof a_pair.value === "string") a_pair.value = a_pair.value[0].toUpperCase() + a_pair.value.substring(1).toLowerCase(); 
            update_attribute[i].value = a_pair.value;
            break;
          }
        }
      }
    }
    myproduct.attribute = update_attribute;
    const updated = await myproduct.save();
    return updated

  } catch (err) {
    console.log(err)
    throw(err)
  }
}

const mysqlIDExist = async (mysqlid) => {
  const exist = await product.exists({mysql_id: mysqlid});
  return exist;
}


// check if an object is empty
function isEmpty(o){
  return (o === undefined || o == null || o == "" || o.length ==0);
}

module.exports = {deleteProductByMysqlId, saveProduct, getAllProducts, dropAll, findProductsByAttribute, getAttributeGroups, updateProduct, findProductByMysqlID}