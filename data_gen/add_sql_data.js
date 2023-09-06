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

    connection.beginTransaction(async (err) => {
        if (err) console.log(err);
        // Execute: create tables
        await executeSqlFile('./sql_data/db_create.sql');
        // // Execute: partiotn tables
        // await executeSqlFile('./sql_data/db_partition.sql');
        // Execute: add indexes on tables
        await executeSqlFile('./sql_data/db_add_index.sql');
        // Execute: insert data
        await executeSqlFile('./sql_data/db_inserts.sql');
        // Procedures file, like ./sql_data/procedure_warehouse_trans.sql
        // These files must not specify delimiter; but if you want to copy them in dbms, then you need delimiter
        // proc with transaction to insert product into warehouse
        await executeSqlFile('./sql_data/procedure_warehouse_trans.sql');
        // proc with transaction to place order
        await executeSqlFile('./sql_data/procedure_place_order.sql');
        // proc to free product volume from most populated warehouse
        await executeSqlFile('./sql_data/procedure_free_wh_space.sql');
        // trigger to call the proc above when order status is updated
        await executeSqlFile('./sql_data/trigger_update_order.sql');
        // proc to move product * quantity from one warehouse to another
        await executeSqlFile('./sql_data/procedure_wh_move.sql');
        // trigger when delete product: check inbound, free wh space, delete from cart and order
        await executeSqlFile('./sql_data/trigger_delete_product.sql');

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
