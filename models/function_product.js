const database = require('./connection/dbSqlConnect');
const { parenthesesString } = require('../helperFuncs');

async function from_id (pid) {
    return new Promise ((resolve, reject) => {
        database.query(`SELECT *
        FROM product
        WHERE id = ${pid};`, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
}

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
}

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
                    else resolve(results);
                });
        }
        else{
            database.query(`SELECT product.*, user.user_name AS seller_username, user.display_name AS seller_display_name
                FROM product
                INNER JOIN user ON product.seller_id = user.id 
                WHERE seller_id = ${query_seller_id}
                ORDER BY created_at DESC;`, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
        }
    })
}

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
}

async function getPrice(pid){
    return new Promise((resolve, reject) => {
        database.query(`SELECT price FROM product WHERE id = ${pid} LIMIT 1;`, function (err, result){
            if (err) reject({"message":"Error getting price " + err});
            // else resolve(parseInt(result.price));
            else resolve(result[0].price);
        });
    });
}

async function getVolume(pid){
    return new Promise((resolve, reject) => {
        database.query(`SELECT length, width, height FROM product 
            WHERE id = ${pid} LIMIT 1;`, function (err, result){
            if (err) reject({"message":"Error getting dimensions " + err});
            // else resolve(parseInt(result.price));
            else resolve(result[0].length * result[0].width * result[0].height);
        });
    });
}

async function addToCart(uid, pid){
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM cart_details WHERE customer_id = ${uid} AND product_id = ${pid}`, (err, result) =>{
            if(err) reject (err);
            if(result.length > 0){
                database.query(`UPDATE cart_details SET quantity = quantity + 1 
                WHERE customer_id = ${uid} AND product_id = ${pid};`, (err, result) => {
                    if(err) reject (err);
                    else resolve (result);
                })
            } else {
                database.query(`INSERT INTO cart_details VALUE (${uid}, ${pid}, ${1})`, (err, result) =>{
                    if (err) reject (err);
                    else resolve(result);
                })
            }
        })
    })
}

module.exports = { from_category, from_seller, from_id, contain_word, getPrice, getVolume}

