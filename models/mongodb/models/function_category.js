const mongoose = require("mongoose");
const {category} = require('./category');
const {product} = require('./product');
const ObjectId = mongoose.Types.ObjectId;

// create a category
const saveCat = async(newID, newName, newAtt, newPAId) => {
    try {
        var newCat = new category;
        if (newID) newCat._id = newID
        newCat.name = newName;
        newCat.parent_category = newPAId;
        let saved = await newCat.save();

        // add attributes
        saved = await addAttributesToCat(saved, newAtt);
        console.log("=== Category " + saved.name + " saved to DB.");
        return saved;
    }
    catch (error) {
        console.log("Category save error: " + error);
        throw(err)
    }
}

//create list of categories
const createCats = async(list_cats) => {
    try {
        for (cat of list_cats) {
            saveCat(cat._id, cat.name, cat.attribute, cat.parent_category);
        }
    }
    catch (error) {
        console.log("Create categories error: " + error);
    }

}

//get all categories in db
const getAllCats = async(limit) => {
    try {
        if (limit) {
            const allCats = await category.find().limit(limit);
            return allCats
        }
        const allCats = await category.find();
        return allCats
    }
    catch (err) {
        console.error('Get all category failed: ', err)
        throw(err)
    }
}

//delete all categories in db
const dropAll = async () =>{
    await category.deleteMany({});
}

// find a cat by id
const findCatById = async(id) => {
    try {
        const cat = await category.findOne({_id: id});
        return cat;
    } catch (err) {
        console.log("Failed to find category by id: ", err);
    }
}

// find a cat by name
const findCatByName = async (name) => {
    try {
        const cat = await category.findOne({ name: name});
        return cat
    }
    catch (err) {
        console.log("Failed to find category by name: ", err);
    }
}

//get all children (and below) of a category
const getAllChildren = async (id) => {
    try {
        const children_cats = await category.aggregate( [
            { $match: { _id: ObjectId(id) } },
            { $graphLookup: {
                  from: "categories",
                  startWith: "$_id",
                  connectFromField: "_id",
                  connectToField: "parent_category",
                  as: "children"
               }
            },
            { $project: { // each record will show category _id and list of its children's ids
                _id: 1,
                "children_categories": "$children._id"
              }
            }
        ] )

        // aggregation will return an array
        // however, we search by id, so we know that the array will have only one element
        // thus, we only need to return the element at index 0
        if (children_cats.length == 1) return children_cats[0];
        else return null
    } catch (err) {
        console.log(err)
    }
}

//get all parents (and above) of a category
const getAllParents = async (id) => {
    try {
        const parents = await category.aggregate( [
            { $match: { _id: ObjectId(id) } },
            { $graphLookup: {
                  from: "categories",
                  startWith: "$parent_category",
                  connectFromField: "parent_category",
                  connectToField: "_id",
                  as: "parents"
               }
            },
            { $project: { // each record will show category _id and list of its children's ids
                _id: 1,
                "parent_categories": "$parents._id"
              }
            }
        ] )

        // aggregation will return an array
        // however, we search by id, so we know that the array will have only one element
        // thus, we only need to return the element at index 0
        if (parents.length == 1) return parents[0];
        else return null
    } catch (err) {
        console.log(err)
    }
}

// get lowest level categories (categories that are not a parent of any category)
const getLowestLevelCats = async () => {
    try {
        const cats = await category.aggregate( [
            { $lookup: {
                  from: "categories",
                  localField: "_id",
                  foreignField: "parent_category",
                  as: "child"
                }
            },
            { $match: {child: {$size: 0}} // select record that has no child 
            },
            { $project: { // show only _id and name for each record
                _id: 1,
                name: 1
              }
            }
        ])

        // aggregation will return an array
        return cats

    } catch (err) {
        console.log(err)
    }
}

// deleteCat() delete a category by id
// then update parent_category of its children to null
// return the deleted category
// (only when that category & its children dont have any product)
const deleteCat = async(id) => {
    const session = await category.startSession();
    session.startTransaction();
    try {
        const notAssociated = await isNotAssociatedWithProduct(id);
        if (!notAssociated) throw new Error("cannot delete category that has product");
        const deleted = await category.findOneAndDelete({ _id : id });
        if (deleted == null) throw new Error(`No category with id = ${id}`)
        await category.updateMany(  {parent_category: id},
                                    {$set: {parent_category: null}}
                                );
        await session.commitTransaction();
        session.endSession();
        return deleted;
    }
    catch (error) {
        console.log(error)
        await session.abortTransaction();
        session.endSession();
        throw(error)
    }
}

// deleteCat() delete a category by id and all of its children tree
// return a list of delelted cats
// (only when that category & its children dont have any product)
const deleteCatAndChildren = async(id) => {
    const session = await category.startSession();
    session.startTransaction();
    try {
        const notAssociated = await isNotAssociatedWithProduct(id);
        if (!notAssociated) throw new Error("cannot delete category that has product");

        const delete_list = [];
        const children = await getAllChildren(id);
        let deleted = await category.findOneAndDelete({ _id : id });
        if (deleted == null) throw new Error(`No category with id = ${id}`)
        delete_list.push(deleted._id);
        for (cat_id of children.children_categories) {
            deleted = await category.findOneAndDelete({ _id : cat_id });
            delete_list.push(deleted._id);
        }
        await session.commitTransaction();
        session.endSession();
        return delete_list;
    }
    catch (error) {
        console.log(error)
        await session.abortTransaction();
        session.endSession();
        throw(error);
    }
}

// updateCat() updates a category (name, parent category, attribute)
// (only when that category & its children dont have any product)
const updateCat = async (id, newName, newAtts, newPAId) => {
    try {
        const notAssociated = await isNotAssociatedWithProduct(id);
        if (!notAssociated) throw new Error("cannot update category that has product");
        let cat = await findCatById(id);
        if (cat) {
            cat = await addAttributesToCat(cat, newAtts)
            if (!isEmpty(newName)) cat.name = newName;
            if (newPAId !== undefined && cat.parent_category != newPAId) {
                cat.parent_category = newPAId;
            }
            cat = await cat.save();
        }

        return cat;
    } catch (error) {
        console.log(error)
        throw(error)
    }
}


/*  - addAttributesToCat() add the list of NEW attributes to a category
    - if a new attribute already exists in the current attributes, it wont be added again
    - Example for newAttributes:
[
    {
        "aName": "Test",
        "aValue": "Test add",
        "aRequired": false
    }
]
*/
const addAttributesToCat = async (cat, newAttributes) => {
    try {
        // if attributes list is not empty
        if (!isEmpty(newAttributes)) {
            for (let i = 0; i< newAttributes.length; i++) {
                let value = newAttributes[i].aName;
                newAttributes[i].aName = value[0].toUpperCase() + value.substring(1).toLowerCase(); 
            }
            const updated = await category.findOneAndUpdate(
                    {_id : cat._id},
                    { $addToSet: { attribute: { $each: newAttributes }}},
                    { returnOriginal: false }
                );
            return updated
        }

        return cat
    } catch (err) {
        console.log(err)
        throw(err)
    }
}


// check if an object is empty
function isEmpty(o){
    return (o === undefined || o == null || o == "" || o.length ==0);
}

// check if a cat itself has any product
const hasProduct = async(id) => {
    try {
        console.log("before checking");
        const catHasProduct = await product.exists({category: id});
        console.log("Cat has product: ", catHasProduct);
        return catHasProduct;
    } catch (err) {
        console.log(err)
    }
}

// check if a category (& its children) is associated with any product
const isNotAssociatedWithProduct = async(id) => {
    try {
        let catHasProduct = await hasProduct(id);
        // if the category has product -> is associated
        if (catHasProduct) return false;
        // if the category has no product -> check if its children is
        const children = getAllChildren(id);
        if (!isEmpty(children.children_categories)) {
            for (catid of children.children_categories) {
                if (hasProduct(id)) return false
            }
        }

        return true;
    } catch (err) {
        console.log(err)
    }
}


// retrieve all attributes of a category (itself' and its parents')
// return array
const getAttributesOfCategory = async (catid) => {
    try{
        const cat = await findCatById(catid)
        // let updated = [];
        let set = new Set()
        if (!isEmpty(cat.attribute))
            for (a of cat.attribute) 
                set.add(a);

        const findParents = await getAllParents(catid)
        if (!isEmpty(findParents.parent_categories)) { // if have parents
          for (pid of findParents.parent_categories) {
            let parent = await findCatById(pid);
            if (!isEmpty(parent.attribute)) { // if parent has attribute
                for (a of parent.attribute) 
                    set.add(a);
            }
          }
        }
        return Array.from(set);;
    }
    catch (err){
        console.log("Cannot inti attributes" + err);
    }
}

module.exports = {saveCat, createCats, getAllCats, dropAll, findCatById, findCatByName, getAllChildren, getAllParents, getLowestLevelCats, deleteCat, deleteCatAndChildren, updateCat, getAttributesOfCategory}