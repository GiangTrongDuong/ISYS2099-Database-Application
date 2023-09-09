const database = require('./connection/dbSqlConnect');
// This file gets warehouse data and calculates how to insert products

// Return the list of all warehouses for admin to check. 
// Here, they can click on one warehouse to see items 
async function warehouse_show_all() { // tested: ok
    return new Promise((resolve, reject) => {
        try {
            database.query(`SELECT id, name AS \'Warehouse Name\', address AS \'Warehouse Address\',
            total_area AS \'Total Area\', remaining_area AS \'Remaining Area\'
            FROM warehouse;`, function (error, result) {
                if (error) reject({ "error with query result": error });
                resolve(result);
            })
        }
        catch (error2) {
            reject({ "error running query": error2 });
        }
    });
}

// tested: ok
async function create_warehouse(info) {
    return new Promise((resolve, reject) => {
        const { newName, newAddress, newTotalArea } = info;
        try {
            database.query(`INSERT INTO warehouse (name, address, total_area, remaining_area)
            VALUES (\'${newName}\', \'${newAddress}\', ${newTotalArea}, ${newTotalArea});`, function (error, result) {
                if (error) reject({ "error insert": error });
                resolve({ "new warehouse id": result.insertId });
            });
        }
        catch (error) {
            reject({ "error running insert query": error });
        }
    });
}

// Get data for a single warehouse
async function read_warehouse(wid) {
    return new Promise((resolve, reject) => {
        try {
            database.query(`SELECT p.id as \'Product ID\', wi.warehouse_id as \'Warehouse ID\', w.name AS \'Warehouse Name\', 
            p.title AS ProductTitle, wi.quantity AS Quantity, 
            ROUND((length * width * height * quantity), 2) AS \'Load Volume\'
            FROM warehouse_item wi, product p, warehouse w
            WHERE wi.product_id = p.id AND wi.warehouse_id = w.id AND w.id = ${wid};`, function (error, result) {
                if (error) reject({ "error with query result": error });
                resolve(result);
            })
        }
        catch (error2) {
            reject({ "error running query": error2 });
        }
    });
}

// update warehouse with wid based on info {name, address}
// Don't let admins change area
async function update_warehouse(wid, info) {
    const { newName, newAddress } = info;
    return new Promise((resolve, reject) => {
        try {
            database.query(`UPDATE warehouse SET name = \'${newName}\', address = \'${newAddress}\'
            WHERE id = ${wid};`, function (error, result) {
                if (error) reject({ "error updating values": error });
                resolve(result);
            });
        }
        catch (error) {
            reject({ "error running update query": error });
        }
    });
}

// Delete a warehouse. There is a trigger that prevent delete if there are products inside of it
async function delete_warehouse(wid) {
    return new Promise((resolve, reject) => {
        try {
            database.query(`DELETE FROM warehouse WHERE id = ${wid};`, function (error1, result1) {
                if (error1) reject({ "error from trigger": error1 });
                resolve(result1);
            });
        }
        catch (error) {
            reject({ "error running delete query": error });
        }
    });
}

// Before moving products from one warehouse to another, this function will return the list of warehouses
// and the number of product_id that it can store. This allows warehouse admin to choose warehouse to move to.
async function get_warehouse_to_store(pid) {
    return new Promise((resolve, reject) => {
        try {
            database.query(`SELECT w.id AS WarehouseID, w.name AS WarehouseName, 
            remaining_area AS RemainingArea, 
            FLOOR(remaining_area / (length * width * height)) as Copies, 
            FROM product p, warehouse w 
            WHERE p.id = ${pid} ORDER BY w.remaining_area DESC;`, function (error, result) {
                if (error) reject(error);
                resolve(result);
            });
        }
        catch (error) {
            reject({ "query error": error });
        }
    });
}

// Move product with id = pid, of some quantity, to a different warehouse
async function move_product_to_wh(pid, quantity, src_wid, dst_wid) {
    return new Promise((resolve, reject) => {
        try {
            database.query(`CALL wh_move_product(${pid}, ${quantity}, ${src_wid}, ${dst_wid});`,
                function (error, result) {
                    if (error) reject({ "error when moving": error });
                    console.log(result[0][0].result);
                    resolve({ "success": result[0][0].result });
                });
        }
        catch (error) {
            reject({ "error calling procedure": error });
        }
    });
}

async function check_storage(pid){
    return new Promise ((resolve, reject) => {
        try {
            database.query(`SELECT w.id AS WarehouseID, w.name AS WarehouseName, remaining_area AS RemainingArea, 
            FLOOR(remaining_area / (length * width * height)) AS Copies
            FROM product p, warehouse w 
            WHERE p.id = ${pid} ORDER BY w.remaining_area DESC;`, (err, result) => {
                if(err) reject (err);
                else resolve(result);
            })
        }catch (err){
            resolve (err);
        }
    })
}

module.exports = {
    warehouse_show_all, create_warehouse, read_warehouse, update_warehouse, delete_warehouse,
    get_warehouse_to_store, move_product_to_wh, check_storage
}