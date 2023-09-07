const { getCurrentTimeString } = require('../helperFuncs');
const {getPrice} = require('./function_product')
const database = require('./connection/dbSqlConnect');

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
    return new Promise((resolve, reject) => {
        try{
            //Update this line later with the total price!
                //Do not add order_id in - it's auto increment!
            database.query(`INSERT INTO order_details (customer_id, status,total_price, created_at)
                VALUES (${uid}, \'Inbound\', 0, \'${getCurrentTimeString()}\');`, async (err, result) => {
                    if (err) {
                        console.log("Insert order_details error" + err)
                        reject ({"Insert order_details error" : err});
                    }
                    const newOrderId = result.insertId;
                    console.log("New order created: " + newOrderId);
                    for (pair of product_quantity_list){
                        const {pid, quantity} = pair;
                        // CALL (order_trans(oid, pid, quant, OUT cost))
                        database.query(
                            `CALL order_trans(${newOrderId},${pid}, ${quantity}, @cost);`, function(err1, result1) {
                                if (err1) {
                                    console.log("Place item error" + err1);
                                    // if 1 item fails, the rest should continue
                                    // reject({"Insert order item error" : err1});
                                }
                                console.log("Item inserted:" + result1)
                            });
                    }
    
                    // Get the order's total price in order_item. If price = 0, delete this order.
                    let total_price = 0;
                    database.query(`SELECT SUM(p.price * o.quantity) as order_cost
                    FROM product p JOIN order_item o ON p.id = o.product_id WHERE o.order_id = ${newOrderId}
                    GROUP BY o.order_id;`, function(err2, result2) {
                        try{
                            total_price = result2[0].order_cost;
                            console.log("=========== Total price " + total_price);
                            database.query(
                                `UPDATE order_details 
                                SET total_price = ${total_price}
                                WHERE id = ${newOrderId};`, function(err4, result){
                                    if (err4) {
                                        console.log("Update after insert "+ err4);
                                    }
                                    console.log("Order placed. oid: " + newOrderId);
                                    resolve ({"message": `Order placed successful! Go to localhost:3000/order/${newOrderId} to check!`});
                                });
                        }
                        catch (err25){
                            console.log("Not enough item in stock.");
                            database.query(`DELETE FROM order_details WHERE id = ${newOrderId};`, function(err3, result3){
                                if (err3) {
                                    console.log("Delete error" + err3);
                                    reject({"Delete error":err3});
                                }
                                console.log("No order was created, because the items you placed went out of stock.");
                                resolve({"message":"No order was created, because the items you placed went out of stock."});
                            });
                        }
                    });
                });
        }
        catch (err){
            reject({"message": "Error placing order: " + err});
        }
    });
}

async function update_status(oid, newStatus){
    return new Promise ((resolve, reject) =>{
        try {
            database.query(`UPDATE order_details SET status = ${newStatus} WHERE id = ${oid};`, function(error, result){
                if (error) {
                    console.log("======= " + error);
                    reject ({"error running update": error});
                }
                console.log()
                resolve(result);
            });
        }
        catch (error){
            console.log("___________"+ error);
            reject({"error running query":error});
        }
    });
}

async function simulate_orders(){
    try{
        var o1 = place_order(6, [{"pid":2, "quantity":2}]);
        var o2 = place_order(9, [{"pid":2, "quantity":2}]);
        Promise.all([o1, o2])
          .then(results => console.log(results)); // [promise1Result, promise2Result]
    }
    catch (err){
        console.log(err);
    }
}

module.exports = { get_orders, get_order_item, place_order, update_status }
