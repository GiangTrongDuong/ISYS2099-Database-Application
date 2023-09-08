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
        if (!isEmpty(newAtt)) await addAttributesToCat(newCat._id, newAtt);
        // add parent's attributes
        saved = await addParentAtt(newCat._id);
        console.log("=== Category " + newCat.name + " saved to DB.");
        return saved;
    }
    catch (error) {
        console.log("Category save error: " + error);
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
const getAllCats = async() => {
    try {
        const allCats = await category.find();
        return allCats
    }
    catch (err) {
        console.error('Get all category failed: ', err)
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

// findCatsByAttribute() takes a pair of attribute name & value, then return a list of category has that attribute
const findCatsByAttribute = async(name) => {
    try {
        //find all cats that have aName = name & aValue = value
        const cats = await category.find({attribute: {$elemMatch: {aName: name}}})
        return cats
    }
    catch (err) {
        console.log("Find by attribute error: " + err);
    }
}

//find all children
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

// get lowest level categories (cats that are not a parent of any category)
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

// add parent's attribute to current object's attribute
// the data is structured nicely so we only need to go up 1 level
const addParentAtt = async (catId) => {
    try{
        const current = await findCatById(catId);
        if (current.parent_category){
            const parent = await findCatById(current.parent_category);
            if (!isEmpty(parent.attribute)) {
                await addAttributesToCat(catId, parent.attribute)
            }
            console.log(`${current.name}: added parent's attributes`);
        }
        return current;
    }
    catch (err){
        console.log("Cannot add parent's attribute" + err);
    }
}


// deleteCat() delete a category by id
// then update parent_category of its children to null
// return the deleted category
const deleteCat = async(id) => {
    const session = await category.startSession();
    session.startTransaction();
    try {
        const deleted = await category.findOneAndDelete({ _id : id });
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
        return null
    }
}

// deleteCat() delete a category by id and all of its children tree
// return a list of delelted cats
// return empty list if no cat found
// return null on error
const deleteCatAndChildren = async(id) => {
    const session = await category.startSession();
    session.startTransaction();
    try {
        const delete_list = [];
        const children = await getAllChildren(id);
        let deleted = await category.findOneAndDelete({ _id : id });
        if (deleted) {
            delete_list.push(deleted._id);
            for (cat_id of children.children_categories) {
                deleted = await category.findOneAndDelete({ _id : cat_id });
                delete_list.push(deleted._id);
            }
        }
        await session.commitTransaction();
        session.endSession();
        return delete_list;
    }
    catch (error) {
        console.log(error)
        await session.abortTransaction();
        session.endSession();
        return null
    }
}

// check if an object is empty
function isEmpty(o){
    return (o === undefined || o == null || o == "" || o.length ==0);
}

//find by category id and update, if parent_cat is updated, parent's attribute will also be added to this cat 
//update name & parent_cat is available now
//still working on update newatt
const updateCat = async (id, newName, newAtts, newPAId) => {
    try {
        const current = await findCatById(id);
        if (current) {
            if (!isEmpty(newName)) current.name = newName;
            if (newPAId !== undefined) {
                current.parent_category = newPAId;
            }
            addAttributesToCat(id, newAtts)
        }
        let updated = await current.save();
        if (current.parent_category) {
            updated = await addParentAtt(id);
        }
        return updated;
    } catch (err) {
        console.log(err)
    }
}


/*  - addAttributesToCat() find and update a cat (add the list of NEW attributes to that category)
    - 
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
const addAttributesToCat = async (catId, newAttributes) => {
    try {
        // if attributes list is not empty
        if (!isEmpty(newAttributes)) {
            const updated = await category.findOneAndUpdate(
                    {_id : catId},
                    { $addToSet: { attribute: { $each: newAttributes }}},
                    { returnOriginal: false }
                );
            return updated
        }

        console.log("attribute list is empty")
        return null
    } catch (err) {
        console.log(err)
    }
}

const getAttributeGroups = async () => {
    try {
        const result = await category.aggregate([
            {
                $unwind: '$attribute'
            },
            {
                $group: {
                    "_id": "$attribute.aName",
                    "aValues": {
                        "$addToSet": "$attribute.aValue"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    "aName": "$_id",
                    "aValues": 1,
                }
            },
        ])
        return result
    } catch (err) {
        console.log(err)
        throw (err)
    }
}



module.exports = {saveCat, createCats, getAllCats, dropAll, findCatById, findCatByName, findCatsByAttribute, getAllChildren, getLowestLevelCats, addParentAtt, deleteCat, deleteCatAndChildren, updateCat, addAttributesToCat, getAttributeGroups }