const category = require('./category.js');

// This file declare methods to interact with mongo DB

// save a category to db
const saveCat = async(newName, newAN, newAV, newAR, newPAName) => {
    try {
        var newCat = new category;
        newCat.name = newName;
        newCat.attribute_name = newAN;
        newCat.attribute_value = newAV;
        if(!newAN){
            newCat.attribute_required = false;
        }
        else{
            newCat.attribute_required = newAR;
        }
        if (!newPAName){
            newCat.parent_category = null;
        }
        else {
            newCat.parent_category = await findIdFromName(newPAName);
        }
        
        var saved = await newCat.save();
        console.log("=== Category " + newName + " saved to DB.");
        console.log("oooooo parent: " + newCat.parent_category);
        // return saved;
    }
    catch (error) {
        console.log("Category save error: " + error);
    }
}

const createCats = async(arrayOfCats) => {

}

const findCatsByAttribute = async(newAN, newAV) => {
    try {
        const sameAN = await category.find({ attribute_name: newAN }, function (err, manyCat) {
            if (err) return console.log("Finding category by attribute: " + err);
        })
        // TODO : loop through manyCat and check for value = newAV
        // return list of category name -> SQL: find product where category in returned list
    }
    catch (err) {
        console.log("Find by attribute error: " + err);
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
//find by category name and update
//find all children
//delete category (we'll check if it has products via sql then call this function)

module.exports = { saveCat, createCats, findCatsByAttribute, findIdFromName }