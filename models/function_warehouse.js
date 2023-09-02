const database = require('./dbSqlConnect');
// This file gets warehouse data and calculates how to insert products

async function get_warehouse_data (wid) {

}

//this will be called by product, which has length x width x height x quantity already
//otherwise, we'll need to query the above (from product) inside
//get list of warehouses that will be able to store the new product (ORDER BY remaining_area DESC)
function get_warehouse_to_store (area_inserted){

}



//from the calculation above, insert the product in here. Maybe write function?
function insert_to_warehouse(pid, quantity, warehouse_list){
    // start transaction
    // for each warehouse in warehouse_list, check remaining_area
    // try insert pid and quantity into warehouse_item
    // if any warehouse.remaining_area < volume(pid) * quantity, abort
    // return true if inserted, false if not and need to try inserting again
}

module.exports = {get_warehouse_data, get_warehouse_to_store, insert_to_warehouse}