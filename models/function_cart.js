const database = require('./connection/dbSqlConnect');

async function getCartItem(uid) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT cd.product_id, cd.quantity, p.title, p.price, cd.quantity*p.price AS totalp, p.image
        FROM cart_details cd JOIN product p
        WHERE cd.product_id = p.id AND cd.customer_id = ${uid};`, (error, results) => {
            if (error) reject(error);
            else {
                const total = results.reduce((acc, curr) => acc + curr.totalp, 0);
                resolve({
                    items: results,
                    total: total
                });
            }
        })
    })
};

async function removeCartItem(uid, pid) {
    return new Promise((resolve, reject) => {
        database.query(`DELETE FROM cart_details 
        WHERE customer_id = ${uid} and product_id = ${pid};`, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        })
    })
};

async function increaseQuantity(uid, pid) {
    return new Promise((resolve, reject) => {
        database.query(`UPDATE cart_details SET quantity = quantity + 1 
        WHERE customer_id = ${uid} AND product_id = ${pid};`, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    })
};

async function decreaseQuantity(uid, pid) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT quantity FROM user WHERE customer_id = ${uid} AND product_id = ${pid}`, (error, result) => {
            if (result[0].quantity == 1) {
                database.query(`DELETE FROM cart_details
            WHERE customer_id = ${uid} and product_id = ${pid};`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            } else {
                database.query(`UPDATE cart_details SET quantity = quantity - 1 
            WHERE customer_id = ${uid} AND product_id = ${pid};`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                })
            }
        });
    })
}



module.exports = { getCartItem, removeCartItem, increaseQuantity, decreaseQuantity }