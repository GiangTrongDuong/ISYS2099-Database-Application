const { connection: database } = require('./connection/dbSqlConnect');
const { parenthesesString, getCurrentTimeString } = require('../helperFuncs');

async function from_id(pid) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT *
        FROM product
        WHERE id = ?;`, [pid], (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
};

async function all() {
    return new Promise((resolve, reject) => {
        database.query(`SELECT *
        FROM product;`, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
};

async function from_ids(pids) {
    return new Promise((resolve, reject) => {
        // Ensure pids is an array
        if (!Array.isArray(pids)) {
            pids = [pids];
        }

        database.query(`SELECT * FROM product WHERE id IN (?);`, [pids], (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

// get products from multiple categories
async function get_from_multiple_categories(ids) {
    return new Promise((resolve, reject) => {
        // Create a string with multiple "?" depending on the number of ids
        const placeholders = ids.map(() => '?').join(',');

        database.query(`SELECT *
                        FROM product
                        WHERE category IN (${placeholders})`, ids, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

async function get_from_a_category(id) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT *
        FROM product
        WHERE category = ?;`, [id], (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
};

// limit is optional, order by created_at; return list of product 
async function from_category(cat_list, limit) {
    //catlist: Bed,Lamp,Computer
    const catString = parenthesesString(cat_list);
    return new Promise((resolve, reject) => {
        if (limit) {
            database.query(`SELECT *
                FROM product
                WHERE category IN ?
                ORDER BY created_at DESC LIMIT ?;`, [catString, limit], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        }
        else {
            database.query(`SELECT *
                FROM product
                WHERE category IN ?
                ORDER BY created_at DESC;`, [catString], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        }
    })
};

// limit is optional, order by created at
// return list of product id i.e. [1,2,3,4,...] currently string: "1,2,3,4,..."
async function from_seller(query_seller_id, limit) {
    return new Promise((resolve, reject) => {
        if (limit) {
            database.query(`SELECT p.*, u.user_name AS seller_username, u.display_name AS seller_display_name
            FROM (SELECT * FROM product WHERE seller_id = ?) AS p 
            JOIN (SELECT id, user_name, display_name FROM user) AS u WHERE p.seller_id = u.id
            ORDER BY created_at DESC;
                LIMIT ? ;`, [query_seller_id, limit], (error, results) => {
                if (error) reject(error);
                else resolve({
                    sellerName: results[0].seller_display_name,
                    sellerUsername: results[0].seller_username,
                    productList: results
                });
            });
        }
        else {
            database.query(`SELECT p.*, u.user_name AS seller_username, u.display_name AS seller_display_name
            FROM (SELECT * FROM product WHERE seller_id = ?) AS p 
            JOIN (SELECT id, user_name, display_name FROM user) AS u WHERE p.seller_id = u.id
            ORDER BY created_at DESC;`, [query_seller_id], (error, results) => {
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
async function contain_word(query_word, limit) {
    return new Promise((resolve, reject) => {
        if (limit) {
            // order by relevance, and then by last created
            database.query(`SELECT * FROM product 
                WHERE MATCH(title, description) AGAINST(\'"?"\' IN BOOLEAN MODE)
                ORDER BY MATCH(title, description) AGAINST(\'"?"\' IN BOOLEAN MODE),
                created_at DESC LIMIT ?;`, [query_word, query_word, limit], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        }
        else {
            database.query(`SELECT * FROM product 
                WHERE MATCH(title, description) AGAINST(\'"?"\' IN BOOLEAN MODE)
                ORDER BY MATCH(title, description) AGAINST(\'"?"\' IN BOOLEAN MODE),
                created_at DESC;`, [query_word, query_word], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        }
    })
};

async function getPrice(pid) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT price FROM product WHERE id = ? LIMIT 1;`, [pid], function (err, result) {
            if (err) reject({ "message": "Error getting price " + err });
            // else resolve(parseInt(result.price));
            else resolve(result[0].price);
        });
    });
};

async function getVolume(pid) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT length, width, height FROM product 
            WHERE id = ? LIMIT 1;`, [pid], function (err, result) {
            if (err) reject({ "message": "Error getting dimensions " + err });
            // else resolve(parseInt(result.price));
            else resolve(result[0].length * result[0].width * result[0].height);
        });
    });
};

// cannot edit remaining: handled by procedure
async function updateDetails(pid, title, price, description) {
    return new Promise((resolve, reject) => {
        database.query(`UPDATE product SET title = ?, price = ?, description = ?, updated_at = \'${getCurrentTimeString()}\' 
        WHERE id = ?;`, [title, price, description, pid], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
};

// add a new product; stock is handled by procedure
async function createProduct(title, seller_id, price, description, category, length, width, height, image, remaining) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT id FROM product WHERE title = "${title}"`, (err, qresult) => {
            if (qresult.length >= 1) {
                resolve("Taken product title");
            } else {
                database.query(`INSERT INTO product (title, seller_id, price, description, category, length, width, height, image, remaining, created_at, updated_at) VALUE (?,?,?,?,?,?,?,?,?,?,"${getCurrentTimeString()}","${getCurrentTimeString()}");`,
                    [title, seller_id, price, description, category, length, width, height, image, remaining],
                    async (err, result2) => {
                        if (err) reject(err);
                        else {
                            try {
                                const message = await insert_to_warehouse(result2.insertId, parseInt(remaining));
                                resolve(result2.insertId);
                            } catch (err) {
                                reject(err);
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
            database.query(`CALL product_to_wh (?, ?);`, [pid, quantity], function (error1, result1) {
                if (error1) reject({ "error": "Error from procedure: " + error1 });
                // var msg = result1[0].result;
                // Show the total number of products currently in warehouses
                database.query(`SELECT SUM(quantity) as ct FROM warehouse_item 
                WHERE product_id = ?;`, [pid], function (error2, result2) {
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

// no other logic needed - trigger handles it
async function deleteProduct(pid) {
    return new Promise((resolve, reject) => {
        database.query(`DELETE FROM product WHERE id = ?;`, [pid], (err, result) => {
            if (err) {
                reject(err);
            } else if (result) {
                resolve(result);
            }
        })
    })
}
module.exports = {
    from_category, from_seller, from_id, from_ids, contain_word, getPrice, getVolume,
    updateDetails, createProduct, insert_to_warehouse, deleteProduct, all, get_from_multiple_categories, get_from_a_category
}

