const database = require('./connection/dbSqlConnect');
const { parenthesesString, getCurrentTimeString } = require('../helperFuncs');

async function from_id (pid) {
    return new Promise ((resolve, reject) => {
        database.query(`SELECT *
        FROM product
        WHERE id = ${pid};`, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
};

async function all () {
    return new Promise ((resolve, reject) => {
        database.query(`SELECT *
        FROM product;`, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
};

// limit is optional, order by created_at; return list of product 
async function from_category (cat_list, limit) {
    //catlist: Bed,Lamp,Computer
    const catString = parenthesesString(cat_list);
    return new Promise ((resolve, reject) => {
        if (limit){
            database.query(`SELECT *
                FROM product
                WHERE category IN ${catString}
                ORDER BY created_at DESC LIMIT ${limit};`, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
            });
        }
        else{
            database.query(`SELECT *
                FROM product
                WHERE category IN ${catString}
                ORDER BY created_at DESC;`, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
            });
        }
    })
};

// limit is optional, order by created at
// return list of product id i.e. [1,2,3,4,...] currently string: "1,2,3,4,..."
async function from_seller (query_seller_id, limit) {
    return new Promise ((resolve, reject) => {
        if (limit){
            database.query(`SELECT product.*, user.user_name AS seller_username, user.display_name AS seller_display_name
                FROM product
                INNER JOIN user ON product.seller_id = user.id 
                WHERE seller_id = ${query_seller_id}
                ORDER BY created_at DESC
                LIMIT ${limit} ;`, (error, results) => {
                    if (error) reject(error);
                    else resolve({
                        sellerName: results[0].seller_display_name,
                        sellerUsername: results[0].seller_username,
                        productList: results
                    });
                });
        }
        else{
            database.query(`SELECT product.*, user.user_name AS seller_username, user.display_name AS seller_display_name
                FROM product
                INNER JOIN user ON product.seller_id = user.id 
                WHERE seller_id = ${query_seller_id}
                ORDER BY created_at DESC;`, (error, results) => {
                    if (error) reject(error);
                    else resolve({
                        sellerName: results[0].seller_display_name,
                        sellerUsername: results[0].seller_username,
                        productList: results
                    });
                });
        }
    })
};

// limit is optional, order by created at
// return list of product id i.e. [1,2,3,4,...] currently string: "1,2,3,4,..."
async function contain_word (query_word, limit) {
    return new Promise ((resolve, reject) => {
        if (limit){
            database.query(`SELECT *
                FROM product 
                WHERE title LIKE '%${query_word}%' OR description LIKE '%${query_word}%' 
                ORDER BY created_at DESC LIMIT ${limit};`, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
        }
        else{
            database.query(`SELECT *
                FROM product 
                WHERE title LIKE '%${query_word}%' OR description LIKE '%${query_word}%' 
                ORDER BY created_at DESC;`, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
        }
    })
};

async function getPrice(pid){
    return new Promise((resolve, reject) => {
        database.query(`SELECT price FROM product WHERE id = ${pid} LIMIT 1;`, function (err, result){
            if (err) reject({"message":"Error getting price " + err});
            // else resolve(parseInt(result.price));
            else resolve(result[0].price);
        });
    });
};

async function getVolume(pid){
    return new Promise((resolve, reject) => {
        database.query(`SELECT length, width, height FROM product 
            WHERE id = ${pid} LIMIT 1;`, function (err, result){
            if (err) reject({"message":"Error getting dimensions " + err});
            // else resolve(parseInt(result.price));
            else resolve(result[0].length * result[0].width * result[0].height);
        });
    });
};

async function updateDetails(pid, title, price, description){
    return new Promise((resolve, reject) => {
        database.query(`UPDATE product SET title = "${title}", price = ${price}, description = "${description}", updated_at = \'${getCurrentTimeString()}\' 
        WHERE id = ${pid};`, (err, result) => {
            if(err) reject (err);
            else resolve(result);
        })
    })
};

async function createProduct(title, seller_id, price, description, category, length, width, height, image, remaining){
    return new Promise((resolve, reject)=> {
        database.query(`SELECt * FROM product WHERE title = "${title}"`, (err, qresult) => {
            if (qresult.length >= 1){
                resolve("Taken product title");
            } else {
                database.query(`
                INSERT INTO product (title, seller_id, price, description, category, length, width, height, image, remaining, created_at, updated_at)
                VALUE ("${title}","${seller_id}","${price}","${description}","${category}",${length},${width}, ${height},"${image}","${remaining}",\'${getCurrentTimeString()}\',\'${getCurrentTimeString()}\');`,
                async (err, result) =>{
                    if(err) reject (err);
                    else {
                        try{
                            const message = await insert_to_warehouse(result.insertId, remaining);
                            resolve(message);
                        }catch(err){
                            resolve(err);
                        }
                    }
                }) 
            }
        })
    })
};

// Called when insert new product, or increase existing product's stock
async function insert_to_warehouse(pid, quantity) {
    return new Promise((resolve, reject) => {
        try {
            database.query(`CALL PROCEDURE(${pid}, ${quantity});`, function (error1, result1) {
                if (error1) reject({ "error": "Error from procedure: " + error1 });
                // var msg = result1[0].result;
                // Show the total number of products currently in warehouses
                database.query(`SELECT SUM(quantity) as ct FROM warehouse_item 
                WHERE product_id = ${pid};`, function (error2, result2) {
                    if (error2) console.log("Error getting total inserted: " + error2);
                    resolve({ "success": `Product with id ${pid} now have ${result2[0].ct} items in warehouses.` });
                });
            });
        }
        catch (error3) {
            reject({ "error": "Error running procedure: " + error3 });
        }
    });
}

async function deleteProduct(pid){
    return new Promise((resolve, reject) => {
        database.query(`DELETE FROM product WHERE id = ${pid};`,(err, result) => {
            if(err){
                reject(err);
            } else if (result){
                resolve(result);
            }
        })
    })
}
module.exports = { from_category, from_seller, from_id, contain_word, getPrice, getVolume, 
    updateDetails, createProduct, insert_to_warehouse, deleteProduct, all}

