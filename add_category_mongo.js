require('dotenv').config();
const fs = require('fs');
const mg_category = require('./models/mongodb/models/function_category');
const {connectMongoDB} = require('./models/connection/mongodbConnect')
const json_fn = './mongodb_data/cat_att_list.json';


//TODO: Specify collection name to ensure consistency?
const forLoop = async (clist) => {
    for (const c of clist){
        try{
            const checkId = await mg_category.findCatById(c._id['$oid']);
            if(!checkId){ //if category is not added
                console.log("\t Saving category: " + c.name);
                const saved = await mg_category.saveCat(c._id['$oid'], c.name, c.attribute, c.parent_category ? c.parent_category['$oid'] : null);
            }
            else{
                console.log("This category is already in the database: " + c.name);
            }
        }
        catch (err){
            // console.log(err);
        }
        
    }
    return;
}


const importData = async () => {
    fs.readFile(json_fn, 'utf-8', async (readErr, data) => {
        try {
            mg_category.dropAll();
            if (readErr) {
                console.log("Error reading file: " + readErr);
                return;
            }
            const json_data = JSON.parse(data);
            await forLoop(json_data);
            console.log('Import Category Success')
            process.exit()
        } catch (error) {
            console.error('Error with Import Category', error)
            process.exit(1)
        }
    })
}


connectMongoDB();
importData();