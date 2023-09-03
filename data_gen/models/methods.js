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


// save a category to db
const saveCat = async(newID, newName, newAtt, newPAId) => {
    try {
        var newCat = new category;
        newCat._id = newID;
        newCat.name = newName;
        newCat.attribute = newAtt
        newCat.parent_category = newPAId;
        
        let saved = await newCat.save();
        saved = addParentAtt(newID)
        console.log("=== Category " + newName + " saved to DB.");
    }
    catch (error) {
        console.log("Category save error: " + error);
    }
}

const createCats = async(arrayOfCats) => {

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
                        if (ca._id == pa._id) {
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
    }
}
//find all children
const getAllChildren = async (id) => {
    try {
        // const cat = await category.findOne({_id: id});
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
            { $project: {
                "children_categories": "$children._id"
              }
            }
        ] )
        
        return children_cats;
    } catch (err) {
        console.log(err)
    }
}

//delete category (we'll check if it has products via sql then call this function)

module.exports = {connectMongoDB, saveCat, createCats, findCatsByAttribute, findCatById, findIdFromName, addAtt, addParentAtt, dropAll, updateCat, getAllChildren}