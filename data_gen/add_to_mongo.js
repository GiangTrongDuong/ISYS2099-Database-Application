require('dotenv').config();
const fs = require('fs');
const mg = require('./models/function_category');
const {connectMongoDB} = require('./models/mongodbConnect')
const json_fn = './cat_att_list.json';

//TODO: Specify collection name to ensure consistency?
const forLoop = async (clist) => {
    for (const c of clist){
        try{
            const checkId = await mg.findCatById(c._id['$oid']);
            if(!checkId){ //if category is not added
                console.log("\t Saving category: " + c.name);
                const saved = await mg.saveCat(c._id['$oid'], c.name, c.attribute, c.parent_category ? c.parent_category['$oid'] : null);
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
            mg.dropAll();
            if (readErr) {
                console.log("Error reading file: " + readErr);
                return;
            }
            const json_data = JSON.parse(data);
            await forLoop(json_data);
            console.log('Data Import Success')
            process.exit()
        } catch (error) {
            console.error('Error with data import', error)
            process.exit(1)
        }
    })
}


connectMongoDB();
importData()

