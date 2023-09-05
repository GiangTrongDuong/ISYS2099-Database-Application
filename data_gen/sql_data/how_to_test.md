Since the procedures are not created in sql clients, we don't need to specify delimiter.
But if you want to copy the procedures and run them in sql clients, add ```DELIMITER $$``` at the beginning,
replace ```END``` with ```END $$```, and add ```DELIMITER ;``` at the end of the procedure.

1. To test ```procedure_warehouse_trans.sql```:
- Run this snippet to find out how many product items can be stored. Replace ```PID``` with a product id of your choice.

```
SELECT w.id, remaining_area, FLOOR(remaining_area / (length * width * height)) as copies
FROM product p, warehouse w WHERE p.id = PID ORDER BY w.remaining_area DESC;
```
- The procedure will choose the warehouse with the most space available. Take a picture/screenshot for good measure.
- Run the procedure by running 
```
- CALL product_to_wh(pid, quantity);
```
- Run the SELECT statement before, compare the new results. If the quantity you entered is more than the warehouse's capacity, you should see it be stored in other warehouses.

NOTE: Woa! There is some bug going on where, if the volume of the product is too small, area and shit will be fucked up! NVA: when demo, choose some big products!

2. To test ```procedure_free_wh_space.sql```:
- Run this snippet to find out the state of the warehouse. Replace pid with any pid of your choice
```
SELECT wh.id, wh.remaining_area from warehouse wh, warehouse_item wi 
where wh.id = wi.warehouse_id and wi.product_id = 87;
```
You may want to screenshot / take a picture.
- Call the procedure by running 
```
CALL free_wh_space(87,1);
```
This will output something like "Warehouse 123 has freed 456 volume units"; check warehouse 123 before and after.

3. To test ```procedure_place_order.sql```:
- You must first insert a new order with
```
INSERT INTO order_details(customer_id, status, total_price, created_at) VALUES (6, 'Inbound', 0, NOW());
```
- Then you can call each of these lines
```
CALL order_trans(101, 15, 1, @cost); --order id, product id, quantity
SELECT @cost;
```
to find out if the order insert is correctly done.
- Total order cost should be inserted separately
- This script should be tested in nodejs using async

4. Test trigger_update_order
- Run each of these statements and note their output (screenshot/picture)
```
-- get an inbound order
SELECT * FROM order_details where status = 'Inbound' order by id desc;
-- get the list of product_id and quantity from your chosen order
SELECT * from order_item where order_id = OID;
-- get the amount of product in stock - replace PID with the product you got
select id, remaining from product where id = PID;
-- get the space of the warehouse storing this product
select wi.*, wh.remaining_area
from warehouse_item wi, warehouse wh 
where wi.warehouse_id = wh.id and product_id = PID order by wh.remaining_area;
```
- Now try and update the order_details table 
```
update order_details set status = 'Rejected' where id = OID;
```
- If status is changed to Rejected: 
    warehouse.remaining_area should stay the same
    product.remaining should increase (to the amount in the second statement)
- If status is changed to Accepted:
    warehouse.remaining_area should be freed up
    product.remaining should stay the same
- If the order status was not inbound, or if the new status is neither Rejected nor Accepted, error will be thrown.

