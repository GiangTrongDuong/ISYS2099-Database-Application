const {product} = require('./product');
const mg_category = require('./function_category');

//delete all categories in db
const dropAll = async () =>{
  await product.deleteMany({});
}

const deleteProductByMysqlId = async(mysqlid) => {
  try {
    const deleted = await product.findOneAndDelete({mysql_id: mysqlid});
    if (deleted == null) throw new Error(`No product with id = ${mysqlid}`)
    return deleted;
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
      // check if this mysql product has been added before
      let exist = await mysqlIDExist(mysqlid);
      if (exist) throw new Error("Product already exists");

      // get attribute list for product
      let attribute = await mg_category.getAttributesOfCategory(categoryid)
      // set value for attribute
      attribute = await setAttributes(attribute, attributes)

      // create product
      var newProduct = await product.create({mysql_id: mysqlid, category: categoryid, attribute: attribute});
      console.log("=== Product " + newProduct.mysql_id + " saved to DB.");
      return newProduct;
  }
  catch (error) {
    if (error.name === "ValidationError") {
      throw new Error("Product is not created because of validation failure. Suggestiton: check if product's attribute is valid.")
    }
    throw(error)
  }
}

// update a product: update value of attribute
const updateProduct = async(mysqlid, attributes) => {
  try {
      let prod = await findProductByMysqlID(mysqlid);
      prod.attribute = await setAttributes(prod.attribute, attributes)
      let saved = await prod.save()
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
      const products = await product.find({attribute: {$elemMatch: {aName: transformWordCase(aName), value: transformWordCase(value)}}})
      return products
  }
  catch (err) {
    throw(err)
  }
}

// findProductsByAttribute() find products that have one of the attributes in the given attributes list 
const findProductsByAttributes = async(attributes) => {
  try {
    let query = []
    for (a of attributes) {
      query.push({aName: transformWordCase(a.aName), value: transformWordCase(a.value)});
    }
    
    //find all products that have one of the attributes in the given attributes list 
    const products = await product.find({
        attribute : {
          $elemMatch: {
            $or: query
          }
        }
      })
    return products
  }
  catch (err) {
    throw(err)
  }
}

// filterProducts() find products having the categoryid (if categoryid is specified (not null)) 
// and have one of the attributes in the given attributes list 
const filterProducts = async(catid, attributes) => {
  try {
    let query = {}
    if (!isEmpty(catid)) query['category'] = catid; 
    if (!isEmpty(attributes)) {
      let query_att = []
      for (a of attributes) {
        query_att.push({aName: transformWordCase(a.aName), value: transformWordCase(a.value)});
      }
      query['attribute'] = {
        $elemMatch: {
          $or: query_att
        }
      }
    }
    
    const products = await product.find(
      query
    )

    let mysqlids = []
    if (!isEmpty(products)) {
      for (p of products)
        mysqlids.push(p.mysql_id)
    }

    return mysqlids
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

// set values for atttributes
const setAttributes = async (product_atts, a_set_list) => {
  try {
    if (!isEmpty(product_atts) && !isEmpty(a_set_list)) {
      for (a_pair of a_set_list) {
        for (let i = 0; i < product_atts.length; i++) {
          if (product_atts[i].aName.toLowerCase() == a_pair.aName.toLowerCase()) {
            let temp = {
              aName: product_atts[i].aName, 
              aValue: product_atts[i].aValue, 
              aRequired: product_atts[i].aRequired, 
              value: transformWordCase(a_pair.value)
            }
            product_atts[i] = temp
            break;
          }
        }
      }
    }
    return product_atts
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

const mysqlIDExist = async (mysqlid) => {
  const exist = await product.exists({mysql_id: mysqlid});
  return exist;
}


// check if an object is empty
function isEmpty(o){
  return (o === undefined || o == null || o == "" || o.length ==0);
}

const transformWordCase = (word) => {
  if (typeof word === "string") 
    word = word[0].toUpperCase() + word.substring(1).toLowerCase(); 
  return word
}

module.exports = {deleteProductByMysqlId, saveProduct, getAllProducts, dropAll, findProductsByAttribute, findProductsByAttributes, getAttributeGroups, updateProduct, findProductByMysqlID, filterProducts}