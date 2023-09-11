//connect to sql database
const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const connection = mysql.createConnection({
    multipleStatements: true,
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE

});

const connectionGuest = mysql.createConnection({
    multipleStatements: true,
    host: process.env.HOST,
    user: process.env.GUEST,
    password: process.env.GUESTPASSWORD,
    database: process.env.DATABASE
});

connection.connect(err =>{
    if (err){
        fs.appendFile('error.log',  `Start Connection ${err}\n'`, (fileErr) =>{
            if(fileErr) {
                console.error('Error writing error.log', fileErr);
            }
        });
        return;
    }
    console.log('Connected to the database as Root Admin');
});



const connectionSeller = mysql.createConnection({
    multipleStatements: true,
    host: process.env.HOST,
    user: process.env.SELLER,
    password: process.env.SELLERPASSWORD,
    database: process.env.DATABASE

});

connectionSeller.connect(err =>{
    if (err){
        fs.appendFile('error.log',  `Start Connection ${err}\n'`, (fileErr) =>{
            if(fileErr) {
                console.error('Error writing error.log', fileErr);
            }
        });
        return;
    }
    console.log('Connected to the database as Seller');
});

const connectionWare = mysql.createConnection({
    multipleStatements: true,
    host: process.env.HOST,
    user: process.env.WAREHOUSE,
    password: process.env.WAREHOUSEPASSWORD,
    database: process.env.DATABASE

});

connectionWare.connect(err =>{
    if (err){
        fs.appendFile('error.log',  `Start Connection ${err}\n'`, (fileErr) =>{
            if(fileErr) {
                console.error('Error writing error.log', fileErr);
            }
        });
        return;
    }
    console.log('Connected to the database as Warehouse');
});

const connectionCustomer = mysql.createConnection({
    multipleStatements: true,
    host: process.env.HOST,
    user: process.env.CUSTOMER,
    password: process.env.CUSTOMERPASSWORD,
    database: process.env.DATABASE

});

connectionCustomer.connect(err =>{ 
    if (err){
        fs.appendFile('error.log',  `Start Connection ${err}\n'`, (fileErr) =>{
            if(fileErr) {
                console.error('Error writing error.log', fileErr);
            }
        });
        return;
    }
    console.log('Connected to the database as Customer');
});

connectionGuest.connect(err =>{
    if (err){
        fs.appendFile('error.log',  `Start Connection ${err}\n'`, (fileErr) =>{
            if(fileErr) {
                console.error('Error writing error.log', fileErr);
            }
        });
        return;
    }
    console.log('Connected to the database as Guest');
});

module.exports = {connection, connectionGuest, connectionSeller, connectionWare, connectionCustomer};