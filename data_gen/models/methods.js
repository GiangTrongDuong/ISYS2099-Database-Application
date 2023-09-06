const mongoose = require("mongoose");
const category = require('./category.js');
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

const getAllCats = async() => {
    try {
        const allCats = await category.find();
        return allCats
    }
    catch (err) {
        console.error('Get all category failed: ', err)
    }

}


// save a category to db
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

// findCatsByAttribute takes a pair of attribute name & value, then return a list of category has that attribute
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

const findCatById = async(id) => {
    try {
        const cat = await category.findOne({_id: id});
        return cat;
    } catch (err) {
        console.log(err)
    }
}


//find by category name and return id (used when creating category)
const findIdFromName = async (newName) => {
    try {
        const sameName = await category.findOne({ name: newName}, function (err, oneCat){
            if (err) return console.log("Finding category by name: " + err)
        });
        if (sameName != null){
            console.log("Found id: " + sameName._id);
            return sameName._id;
        }
        else{
            console.log("Cannot find category with name: " + newName);
        }
    }
    catch (err) {
        console.log("Find by name error: " + err);
    }
}

// add parent's attribute to current object's attribute
// the data is structured nicely so we only need to go up 1 level
const addParentAtt = async (catId) => {
    try{
        const current = await findCatById(catId);
        if (current.parent_category){
            const parent = await findCatById(current.parent_category);
            if (parent.attribute) {
                for (const pa of parent.attribute) {
                    let existed = false;
                    for (const ca of current.attribute) {
                        if (ca.aName == pa.aValue || ca._id == pa._id) {
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

const dropAll = async () =>{
    await category.deleteMany({});
}


//find by category id and update
const updateCat = async (newCat) => {
    try {
        const oldCat = await findCatById(newCat._id)
    } catch (err) {
        console.log(err)
        throw (err)
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


module.exports = {connectMongoDB, saveCat, createCats, findCatsByAttribute, findCatById, findIdFromName, addParentAtt, dropAll, updateCat, getAllChildren, getAllCats, getLowestLevelCats, deleteCat, deleteCatAndChildren}