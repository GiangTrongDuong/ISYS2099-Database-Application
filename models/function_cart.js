const database = require('./connection/dbSqlConnect');

async function getCartItem(uid){
    return new Promise ((resolve, reject) => {
        database.query(`SELECT cd.product_id, cd.quantity, p.title, p.price, cd.quantity*p.price AS totalp
        FROM cart_details cd JOIN product p
        WHERE cd.product_id = p.id AND cd.customer_id = ${uid};`, (error, results) => {
            if(error) reject (error);
            else resolve(results);
        })
    })
}

module.exports = { getCartItem }