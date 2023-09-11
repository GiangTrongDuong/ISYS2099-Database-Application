//connect to sql database
const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const connection = mysql.createConnection({
    multipleStatements: true,
    host: process.env.HOST,
    user: process.env.CUSTOMER,
    password: process.env.CUSTOMERPASSWORD,
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
    console.log('Connected to the database');
});

module.exports = connection;