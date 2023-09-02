require('dotenv').config();
const fs = require('fs');
const mg = require('./models/methods');
const json_fn = './cat_att_list.json';

//TODO: Specify collection name to ensure consistency?
const forLoop = async (clist) => {
    for (const c of clist){
        try{
            const checkId = await mg.findIdFromName(c.name);
            if(!checkId){
                console.log("\t Saving category: " + c.name);
                // save instead of create so that we catch error for the category
                if (c.parent_category){
                    const saved = await mg.saveCat(c._id['$oid'], c.name, c.attribute_name, c.attribute_value, c.attribute_required, c.parent_category['$oid']);
                }
                else{
                    const saved = await mg.saveCat(c._id['$oid'], c.name, c.attribute_name, c.attribute_value, c.attribute_required, null);
                }
                console.log("Added category: " + c.name);
                console.log("Adding attributes...");
                try{
                    await mg.addAtt(c.name);
                }
                catch(err){
                    console.log("OOOOOOOOOO " + err);
                }
                console.log("--------------------------------------------");
            }
            else{
                console.log("This category is already in the database: " + c.name);
            }
        }
        catch (err){
            console.log(err);
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

mg.connectMongoDB();
importData()

