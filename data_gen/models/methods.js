const category = require('./category.js');

// This file declare methods to interact with mongo DB
const saveCat = async(newName, newAN, newAV, newAR, newPA) => {
    try {
        var newCat = new category;
        newCat.name = newName;
        newCat.attribute_name = newAN;
        newCat.attribute_value = newAV;
        newCat.attribute_required = newAR;
        newCat.parent_attribute = newPA;
        var saved = await newCat.save();
        console.log("Category " + newName + " saved.");
        // return saved;
    }
    catch (error) {
        console.log("Category save error: " + error);
    }
}

const findCatsByAttribute = async(newAN, newAV) => {
    try {
        const sameName = await category.find({ attribute_name: newAN }, function (err, manyCat) {
            if (err) return console.log("Finding category: " + err);
        })
        // TODO : loop through manyCat and cehck newAV
        // return list of category name -> find product where category in returned list
    }
    catch (err) {
        console.log("Find error: " + err);
    }
}

//find by category name and return id (used when creating category)
//find by category name and update
//

module.exports = { saveCat, findCatsByAttribute }