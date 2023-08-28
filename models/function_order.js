const database = require('./dbSqlConnect');

async function get_orders (uid) {
    return new Promise ((resolve, reject) => {
        database.query(`SELECT o.id, u.user_name, 
            u.display_name, o.status, o.total_price 
        FROM order_details o JOIN user u ON o.customer_id = u.id
        WHERE u.id = ${uid};`, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
}

//sample output: [{product_id: 94, product_name: "abc", quantity:6}, {...}]
async function get_order_item (oid) {
    return new Promise((resolve, reject) =>{
        database.query(`SELECT o.product_id, p.title AS product_name, o.quantity 
        FROM order_item o JOIN product p ON o.product_id = p.id
        WHERE order_id = ${oid};`, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
}

module.exports = { get_orders, get_order_item }
