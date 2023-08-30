const category = require('./category.js');

// This file declare methods to interact with mongo DB

// save a category to db
const saveCat = async(newID, newName, newAN, newAV, newAR, newPAId) => {
    try {
        var newCat = new category;
        newCat._id = newID;
        newCat.name = newName;
        // attribute
        var an = newAN;
        var av = newAV;
        var ar = false;
        if(!newAN){
            ar = false;
        }
        else{
            ar = newAR;
        }
        newCat.attribute = [
            {aName: an,
            aValue: av,
            aRequired: ar}
        ]
        //
        if (!newPAId){
            newCat.parent_category = null;
        }
        else {
            newCat.parent_category = newPAId;
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

// the below is not tested
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

// add parent's attribute to current object's attribute
// the data is structured nicely so we only need to go up 1 level
const addAtt = async (catName) => {
    try{
        const current = await category.findOne({name: catName});
        if (current.parent_category){
            console.log(current.name);
            // console.log("ooooooooooo" + current.parent_category);
            const parent = await category.findById(current.parent_category);
            try{
                // console.log("cccccccccccccc"); //check if parent is found
                if (parent.attribute[0].aName){
                    current.attribute.push(...parent.attribute);
                    await current.save();
                }
                // console.log("DDDDDDDDDDDDDDD"); // announce save is done
            } catch (err){
                console.log("PPPPPPPPP" + err);
            }
        }
    }
    catch (err){

    }
}

const dropAll = async () =>{
    await category.deleteMany({});
}

//find by category name and update
//find all children
//delete category (we'll check if it has products via sql then call this function)

module.exports = { saveCat, createCats, findCatsByAttribute, findIdFromName, addAtt, dropAll}