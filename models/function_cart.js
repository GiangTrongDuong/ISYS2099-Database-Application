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


async function addToCart(uid, pid, additionalQuantity = 1){
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM cart_details WHERE customer_id = ${uid} AND product_id = ${pid}`, (err, uresult) =>{
            if(uresult.length >= 1){
                // if product already in cart, increase quantity
                database.query(`UPDATE cart_details SET quantity = quantity + ${additionalQuantity}
                WHERE customer_id = ${uid} AND product_id = ${pid};`, (err, result) => {
                    if(err) reject (err);
                    else resolve (result);
                })
            } else {
                // if product not in cart, add to cart
                database.query(`INSERT INTO cart_details VALUE (${uid}, ${pid}, ${additionalQuantity})`, (err, result) =>{
                    if (err) reject (err);
                    else resolve(result);
                })
            }
            console.log(uresult);
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
        database.query(`SELECT quantity FROM cart_details WHERE customer_id = ${uid} AND product_id = ${pid}`, (error, result) => {
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
async function changeQuantity(uid, pid, newQuantity) {
    return new Promise((resolve, reject) => {
        if (newQuantity == 0) {
            database.query(`DELETE FROM cart_details
            WHERE customer_id = ${uid} and product_id = ${pid};`, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        }
        else {
            database.query(`UPDATE cart_details SET quantity = ${newQuantity}
        WHERE customer_id = ${uid} AND product_id = ${pid};`, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            })
        }
    })
};

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

module.exports = { getCartItem, removeCartItem, increaseQuantity, decreaseQuantity, changeQuantity, addToCart, place_order }