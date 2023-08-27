require('dotenv').config();
const fs = require('fs');
const mg = require('./models/methods');
const mongoose = require('mongoose');
// const express = require('express');
const json_fn = './categoryData.json';

//TODO: Specify collection name to ensure consistency?
const forLoop = async (clist) => {
    for (const c of clist){
        try{
            const checkId = await mg.findIdFromName(c.name);
            if(!checkId){
                console.log("\t Saving category: " + c.name);
                // save instead of create so that we catch error for the category
                const saved = await mg.saveCat(c.name, c.AttName, c.AttValue, c.AttRequired, c.Parent);
                console.log("Added category: " + c.name);
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

fs.readFile(json_fn, 'utf-8', async (readErr, data) => {
    if (readErr) {
        console.log("Error reading file: " + readErr);
        return;
    }
    const json_data = JSON.parse(data);
    await forLoop(json_data);
})
// mongoose.disconnect();



