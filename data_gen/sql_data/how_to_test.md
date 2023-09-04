Since the procedures are not created in sql clients, we don't need to specify delimiter.
But if you want to copy the procedures and run them in sql clients, add ```DELIMITER $$``` at the beginning,
replace ```END``` with ```END $$```, and add ```DELIMITER ;``` at the end of the procedure.

1. To test ```db_warehouse_trans.sql```:
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


