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
        executeSqlFile('./db_create.sql');
        // var rl1 = readline.createInterface({
        //     input: fs.createReadStream('./db_create.sql'),
        //     terminal: false
        //    });
        //   rl1.on('line', function(chunk){
        //     connection.query(chunk.toString('ascii'), function(err, sets, fields){
        //         if(err){
        //             fs.appendFile('error.log', `===== Create: ${err}\n`, (fileErr) => {
        //                 if (fileErr) {
        //                     console.error('Error writing to error.log:', fileErr);
        //                 }
        //             });
        //         }
        //     });
        //   });

        // Execute: insert data
        executeSqlFile('./db_inserts.sql');
        // var rl2 = readline.createInterface({
        //     input: fs.createReadStream('./db_inserts.sql'),
        //     terminal: false
        //    });
        //   rl2.on('line', function(chunk){
        //     connection.query(chunk.toString('ascii'), function(err, sets, fields){
        //         if(err){
        //             fs.appendFile('error.log', `===== Insert: ${err}\n`, (fileErr) => {
        //                 if (fileErr) {
        //                     console.error('Error writing to error.log:', fileErr);
        //                 }
        //             });
        //         }
        //     });
        //   });

    // Commit the transaction if everything is successful
        connection.commit((err => {
            if (err) {
                connection.rollback();
            }
            console.log('Finished writing people table');
        }));
    });
});
