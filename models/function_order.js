const { getCurrentTimeString } = require('../helperFuncs');
const {getPrice} = require('./function_product')
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
        WHERE order_id = ${oid};`, (error1, results1) => {
            if (error1) reject(error1);
            database.query(`SELECT total_price FROM order_details WHERE id = ${oid};`, (error2, results2) => {
                if (error2) reject (error2);
                else resolve({"order_items": results1, "total_price": results2});
            })
        });
    });
}

// pass in param: [{'pid': 2, 'quantity': 10}, {...}]
async function place_order(uid, product_quantity_list){
    try{
        //Update this line later with the total price!
            //Do not add order_id in - it's auto increment!
        database.query(`INSERT INTO order_details (customer_id, status,total_price, created_at)
            VALUES (${uid}, \'Inbound\', 0, \'${getCurrentTimeString()}\');`, async (err, result) => {
                if (err) return console.log("Insert error: " + err);
                const newOrderId = result.insertId;
                let total_price = 0;
                for (pair of product_quantity_list){
                    const {pid, quantity} = pair;
                    database.query(
                        `INSERT INTO order_item (order_id, product_id, quantity) 
                        VALUES (${newOrderId}, ${pid}, ${quantity});`, async(err1, result) =>{
                            if (err1) console.log("Insert order item error: " + err1);
                        });
                    var product_price = await getPrice(pid);
                    // console.log("\t MMM "+ product_price);
                    total_price += product_price * parseInt(quantity);
                }
                database.query(
                    `UPDATE order_details 
                    SET total_price = ${total_price}
                    WHERE id = ${newOrderId};`, function(err2, result){
                        if (err2) return console.log("Error update after insert: " + err2);
                    });
                // TODO: Get this one to show to see new order id
                return ({"message": `Order placed successful! Go to localhost:3000/order/${newOrderId} to check!`});
            });
        console.log("Order details and item inserted.");
        return({"message":"Your order has been placed!"});
    }
    catch (err){
        return({"message": "Error placing order: " + err});
    }
}

module.exports = { get_orders, get_order_item, place_order }
