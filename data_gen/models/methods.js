const mongoose = require("mongoose");
const {category} = require('./category.js');
const ObjectId = mongoose.Types.ObjectId;

const connectMongoDB = () => {
    console.log('Connecting to MongoDB ...')
    mongoose.connect(
        process.env.MONGODB_URI,
      {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(() => {
      console.log('MongoDB connection SUCCESS');
    })
    .catch((err) => {
      console.error('MongoDB connection FAIL', err)
    });
}

// create a category
const saveCat = async(newID, newName, newAtt, newPAId) => {
    try {
        var newCat = new category;
        if (newID) newCat._id = newID
        newCat.name = newName;
        newCat.attribute = newAtt
        newCat.parent_category = newPAId;
        
        let saved = await newCat.save();
        saved = addParentAtt(newCat._id);
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

const findCatById = async(id) => {
    try {
        const cat = await category.findOne({_id: id});
        return cat;
    } catch (err) {
        console.log("Failed to find category by id: ", err);
    }
}

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
const findCatsByAttribute = async(name, value) => {
    try {
        //find all cats that have aName = name & aValue = value
        const cats = await category.find({attribute: {$elemMatch: {aName: name, aValue: value}}})
        return cats
    }
    catch (err) {
        console.log("Find by attribute error: " + err);
    }
}

//find by category name and return id (used when creating category)
const findIdFromName = async (name) => {
    try {
        const sameName = await category.findOne({ name: name});
        if (sameName != null){
            console.log("Found id: " + sameName._id);
            return sameName._id;
        }
        else{
            console.log("No category with name: " + newName);
        }
    }
    catch (err) {
        console.log("Find by name error: " + err);
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
        throw(err)
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
        throw(err)
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
                for (const pa of parent.attribute) {
                    let existed = false;
                    for (const ca of current.attribute) {
                        if (twoAttsEqual(ca, pa)) {
                            existed = true;
                            break;
                        }
                    }
                    if (!existed) current.attribute.push(pa);
                }
                await current.save();
                console.log(`${current.name}: added parent's attribute (parent is ${parent.name})`);
            }
        }
        else {
            console.log(`${current.name}: no parent to inherit attribute`);
        }
        return current;
    }
    catch (err){
        console.log("Cannot add parent's attribute" + err);
        throw(err)
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

const twoAttsEqual = (a1, a2) => {
    // return (a1.aName == a2.aName && a1.aValue == a2.aValue && a1.aRequired == a2.aRequired);
    return (a1.aName == a2.aName && a1.aValue == a2.aValue);

}

function isEmpty(o){
    return (o === undefined || o == null || o == "" || o.length ==0);
}


//find by category id and update, if parent_cat is updated, parent's attribute will also be added to this cat 
//update name & parent_cat is available now
//still working on update newatt
const updateCat = async (id, newName, newAtts, newPAId) => {
    try {
        const current = await findCatById(id);
        if (!isEmpty(current)) {
            if (!isEmpty(newName)) current.name = newName;
            if (newPAId !== undefined) {
                current.parent_category = newPAId;
            }
            // addAttributesToCat(id, newAtts)
        }
        let updated = await current.save();
        if (!isEmpty(current.parent_category)) {
            updated = await addParentAtt(id);
        }
        return updated;
    } catch (err) {
        console.log(err)
        throw (err)
    }
}


/*  - addAttributesToCat() find cat by id, then add the list of attributes to that category
    - if a new attribute already exists in the current attributes, it wont be added again
    - Example for newAttributes:
[
    {
        "aName": "Test",
        "aValue": "Test add",
        "aRequired": false
    },
    {
        "aName": "Test 4",
        "aValue": "Test add 4",
        "aRequired": false
    }
]
*/
const addAttributesToCat = async (catId, newAttributes) => {
    try {
        if (newAttributes.length == 0) throw("attribute list is empty");
        const current = await findCatById(catId);
        for (newAtt of newAttributes) {
            let existed = false;
            for (att of current.attribute) {
                if (twoAttsEqual(newAtt, att)) {
                    existed = true;
                    break;
                }
            }
            if (!existed) current.attribute.push(newAtt);
        }
        
        const updated = await current.save()
        return updated
    } catch (err) {
        console.log(err)
        throw (err)
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



module.exports = {connectMongoDB, saveCat, createCats, getAllCats, dropAll, findCatById, findCatByName, findCatsByAttribute, findIdFromName, getAllChildren, getLowestLevelCats, addParentAtt, deleteCat, deleteCatAndChildren, updateCat, addAttributesToCat, getAttributeGroups }