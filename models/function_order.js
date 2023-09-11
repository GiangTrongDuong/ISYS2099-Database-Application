const {getPrice} = require('./function_product')
const {connectionCustomer: database} = require('./connection/dbSqlConnect');

async function get_orders (uid) {
    return new Promise ((resolve, reject) => {
        database.query(`SELECT o.id, u.user_name, u.display_name, o.status, o.total_price 
        FROM order_details o JOIN (SELECT * FROM user WHERE id = ?) AS u
        ON o.customer_id = u.id;`,[uid], (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
}

// show product id, title, quantity for an order
async function get_order_item (oid) {
    return new Promise((resolve, reject) =>{
        database.query(`SELECT o.product_id, p.title AS product_name, o.quantity 
        FROM (SELECT product_id, quantity FROM order_item WHERE order_id = ?) AS o 
        JOIN (SELECT id, title FROM product) AS p ON o.product_id = p.id;`,[oid], (error1, results1) => {
            if (error1) reject(error1);
            database.query(`SELECT total_price, status, id FROM order_details WHERE id = ?;`,[oid], (error2, results2) => {
                if (error2) reject (error2);
                else resolve({"order_items": results1, "order": results2});
            })
        });
    });
}

// place order moved to cart to reuse functions


// change status of order
async function update_status(oid, newStatus){
    // the trigger handles different cases of old status -> just need to update
    return new Promise((resolve, reject) =>{
        try{
            database.query(`UPDATE order_details SET status = ? WHERE id = ?;`,[newStatus,oid], (error, result) =>{
                if (error) {
                    console.log({"error with query update": error});
                    reject(error); //custom error message set in trigger
                }
                resolve ({"success":"Order status updated successfully."});
            });
        }
        catch (error){
            console.log({"error updating order status":error});
            reject(error);
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

module.exports = { get_orders, get_order_item, update_status, simulate_orders}