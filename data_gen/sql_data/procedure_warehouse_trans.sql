DROP PROCEDURE IF EXISTS product_to_wh;
CREATE PROCEDURE product_to_wh(
    IN pid INT,
    IN quant INT
)
BEGIN
    -- volume of one product item
    DECLARE volume_of_one decimal(10,2); 
    -- total volume of products being inserted
    DECLARE total_inserted decimal(10,2); 
    -- check if the (warehouse_id, product_id) pair exists in warehouse_item; get its quantity
    DECLARE existing_quantity INT;
    -- wid, rem_area: to get the warehouse that can store some (or all) of the load
    DECLARE wid INT;
	DECLARE rem_area INT;
    -- get the portion of the load that was inserted
    DECLARE volume_inserted decimal(10,2);
    DECLARE quantity_inserted int; 
    -- Exception handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; -- Rollback the transaction on error
        RESIGNAL; -- Propagate the error
    END;
    -- init values
    SELECT length * width * height INTO volume_of_one
    FROM product WHERE id = pid;    
    SET total_inserted = volume_of_one * quant;
    -- Start a transaction
    START TRANSACTION;
    WHILE quant > 0 DO
        -- Find a warehouse with sufficient remaining_area - pick the ones with most remaining_area first
        SELECT w.id, w.remaining_area INTO wid, rem_area 
        FROM warehouse w WHERE w.remaining_area >= total_inserted
        ORDER BY remaining_area DESC LIMIT 1;

		-- found a warehouse to store all the load
        IF wid IS NOT NULL THEN
			-- check if (warehouse id, product id) exists in warehouse_item
			SELECT w.quantity INTO existing_quantity FROM warehouse_item w
            WHERE w.warehouse_id = wid AND w.product_id = pid LIMIT 1;

            IF existing_quantity IS NOT NULL THEN
                -- Update the quantity if the pair exists
                UPDATE warehouse_item SET quantity = (quantity + quant)
                WHERE warehouse_id = wid AND product_id = pid;
            ELSE
                -- Insert into the warehouse
                INSERT INTO warehouse_item (warehouse_id, product_id, quantity)
                VALUES (wid, pid, quant);
            END IF;

            -- Update remaining_area in the warehouse
            UPDATE warehouse SET remaining_area = remaining_area - total_inserted WHERE id = wid;

            SET quant = 0; -- All space allocated
            SELECT 'All of the products are allocated.' AS result;
        ELSE
            -- No warehouse with sufficient space found, try the next available warehouse
            -- prioritize ones with more space; only see ones that can store 1 item of product
            SELECT id, remaining_area INTO wid, rem_area 
            FROM warehouse WHERE remaining_area > volume_of_one ORDER BY remaining_area DESC LIMIT 1;
			
            -- Found a warehouse to store some of the load
            IF wid IS NOT NULL THEN
				-- find out how many items this warehouse can store
                SET quantity_inserted = FLOOR(rem_area / volume_of_one);
				
                -- Calculate space to insert into the current warehouse
                SET volume_inserted = quantity_inserted * volume_of_one;
                -- Decrease the load to be inserted next time
                SET total_inserted = total_inserted - volume_inserted;
                SET quant = quant - quantity_inserted;
                -- check if (warehouse id, product id) exists in warehouse_item
				SELECT w.quantity INTO existing_quantity FROM warehouse_item w
				WHERE w.warehouse_id = wid AND w.product_id = pid LIMIT 1;

				IF existing_quantity IS NOT NULL THEN
					-- Update the quantity if the pair exists
					UPDATE warehouse_item SET quantity = quantity + quantity_inserted 
                    WHERE warehouse_id = wid AND product_id = pid;
				ELSE
					-- Insert into the warehouse
					INSERT INTO warehouse_item (warehouse_id, product_id, quantity)
					VALUES (wid, pid, quantity_inserted);
				END IF;

                -- Update remaining_area in the warehouse
                UPDATE warehouse SET remaining_area = remaining_area - volume_inserted WHERE id = wid;
            ELSE
                -- No warehouse available with any space, exit loop
                SELECT 'No more items of this product can be allocated.' AS result;
                SET quant = 0;
            END IF;
        END IF;
    END WHILE;
    -- Commit the transaction
    COMMIT;
END
