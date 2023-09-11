const {connectionCustomer: database} = require('./connection/dbSqlConnect');
const { getCurrentTimeString } = require('../helperFuncs');

async function getCartItem(uid) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT cd.product_id, cd.quantity, p.title, p.price, cd.quantity*p.price AS totalp, p.image
        FROM  product p JOIN (SELECT * FROM cart_details cd WHERE cd.customer_id = ?) AS cd
        ON cd.product_id = p.id;`, [uid],(error, results) => {
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
        database.query(`SELECT * FROM cart_details WHERE customer_id = ? AND product_id = ?`,[uid, pid], (err, uresult) =>{
            if(uresult.length >= 1){
                // if product already in cart, increase quantity
                database.query(`UPDATE cart_details SET quantity = quantity + ?
                WHERE customer_id = ? AND product_id = ?;`,[additionalQuantity, uid, pid], (err, result) => {
                    if(err) reject (err);
                    else resolve (result);
                })
            } else {
                // if product not in cart, add to cart
                database.query(`INSERT INTO cart_details VALUE (?,?,?)`,[uid, pid, additionalQuantity], (err, result) =>{
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
        WHERE customer_id = ? and product_id = ?;`,[uid, pid], (error, result) => {
            if (error) reject(error);
            else resolve(result);
        })
    })
};

async function increaseQuantity(uid, pid) {
    return new Promise((resolve, reject) => {
        database.query(`UPDATE cart_details SET quantity = quantity + 1 
        WHERE customer_id = ? AND product_id = ?;`,[uid, pid], (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    })
};

async function decreaseQuantity(uid, pid) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT quantity FROM cart_details WHERE customer_id = ? AND product_id = ?`,[uid, pid], (error, result) => {
            if (result[0].quantity == 1) {
                database.query(`DELETE FROM cart_details
            WHERE customer_id = ? and product_id = ?;`,[uid, pid], (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            } else {
                database.query(`UPDATE cart_details SET quantity = quantity - 1 
            WHERE customer_id = ? AND product_id = ?;`,[uid, pid], (error, result) => {
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
            WHERE customer_id = ? and product_id = ?;`,[uid, pid], (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        }
        else {
            database.query(`UPDATE cart_details SET quantity = ${newQuantity}
        WHERE customer_id = ? AND product_id = ?;`,[uid, pid], (error, result) => {
                if (error) reject(error);
                else resolve(result);
            })
        }
    })
};

// call procedure to place order, then remove cart items
async function place_order(uid){
    return new Promise((resolve, reject) => {
        try{
            //Update this line later with the total price!
                //Do not add order_id in - it's auto increment!
            database.query(`INSERT INTO order_details (customer_id, status,total_price, created_at)
                VALUES (?, \'Inbound\', 0, \'${getCurrentTimeString()}\');`,[uid], async (err, result) => {
                    if (err) {
                        console.log("Insert order_details error" + err)
                        reject ({"Insert order_details error" : err});
                    }
                    const newOrderId = result.insertId;
                    console.log("New order created: " + newOrderId);

                    // get all items in cart
                    database.query(`SELECT product_id, quantity FROM cart_details WHERE customer_id = ?;`,[uid], async(error0, result) =>{
                        if (error0){
                            console.log("get cart details error: " + error0);
                            reject(error0);
                        }
                        console.log(result);
                        for (pair of result){
                            const {product_id, quantity} = pair;
                            // CALL (order_trans(oid, pid, quant, OUT cost))
                            database.query(
                                `CALL order_trans(${newOrderId},${product_id}, ${quantity}, @cost);`, async(err1, result1) => {
                                    if (err1) {
                                        console.log(newOrderId +"//"+product_id + "//" + quantity);
                                        console.log("Place item error" + err1);
                                        // if 1 item fails, the rest should continue
                                        // reject({"Insert order item error" : err1});
                                    }
                                    console.log("Item inserted:" + result1);
                                    await removeCartItem(uid, product_id);
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
                                        resolve ({"orderId": newOrderId});
                                    });
                            }
                            catch (err25){
                                console.log("Not enough item in stock: " + err25);
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
            });
        }
        catch (err){
            reject({"message": "Error placing order: " + err});
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

module.exports = {  getCartItem, removeCartItem, increaseQuantity, decreaseQuantity, 
                    changeQuantity, addToCart, place_order, simulate_orders}