require('dotenv').config();
const mg = require('./models/methods');
// const express = require('express');

const c1 = [
    {
        "name": "electronics",
        "AttName": "return",
        "AttValue": "none",
        "AttRequired": false,
        "Parent": null
    },
    {
        "name": "home appliances",
        "AttName": "return",
        "AttValue": "1 month",
        "AttRequired": false,
        "Parent": null
      },
]
const c2 = [
    {
        "name": "phone and accessories",
        "AttName": "shipping",
        "AttValue": "free shipping",
        "AttRequired": false,
        "Parent": "electronics"
    },
    {
        "name": "computer and accessories",
        "AttName": "shipping",
        "AttValue": "premium shipping",
        "AttRequired": true,
        "Parent": "electronics"
    },
    {
        "name": "kitchen appliances",
        "AttName": "warranty",
        "AttValue": "1 year",
        "AttRequired": false,
        "Parent": "home appliances"
    }
]
const c3 = [
    {
        "name": "phone",
        "AttName": "warranty",
        "AttValue": "1 year",
        "AttRequired": false,
        "Parent": "phone and accessories"
    },
    {
        "name": "phone accessories",
        "AttName": "shipping",
        "AttValue": "free shipping",
        "AttRequired": false,
        "Parent": "phone and accessories"
    },
    {
        "name": "computer",
        "AttName": "warranty",
        "AttValue": "2 year+",
        "AttRequired": false,
        "Parent": "computer and accessories"
    }
]
const forLoop = async (clist) => {
    for (const c of clist){
        try{
            console.log('----');
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
// forLoop(c1);
forLoop(c2);
// forLoop(c3);

