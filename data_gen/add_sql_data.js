const mysql = require('mysql2');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config(); 

const connection = mysql.createConnection({
    multipleStatements: true,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect(err => {
    if (err) {
        fs.appendFile('error.log', `===== Start connection: ${err}\n`, (fileErr) => {
            if (fileErr) {
                console.error('Error writing to error.log:', fileErr);
            }
        });
        return;
    }
    console.log('Connected to the database');
    console.log('============== IMPORTANT =================');
    console.log(`Your tables with name: user, product, warehouse, order_details, 
                order_item, cart_details WILL BE DROPPED.`);

    // Begin a transaction to start pumping data in
    async function executeSqlFile(filePath) {
        const sql = fs.readFileSync(filePath, 'utf-8');
        connection.query(sql, (queryErr, results) => {
            if (queryErr) {
                fs.appendFile('error.log', `===== Query: ${queryErr}\n`, (fileErr) => {
                    if (fileErr) {
                        console.error('Error writing to error.log:', fileErr);
                    }
                });
            }
            else {
                console.log('SQL executed successfully:', results);
            }
        });
    };
    connection.beginTransaction((err) => {
        // Execute: create tables
        executeSqlFile('./sql_data/db_create.sql');
        // Execute: insert data
        executeSqlFile('./sql_data/db_inserts.sql');

    // Commit the transaction if everything is successful
        connection.commit((err => {
            if (err) {
                connection.rollback();
            }
            console.log('Finished writing.');
            // You'll no longer have to manually ctrl + c
            connection.end()
        }));
    });
});
