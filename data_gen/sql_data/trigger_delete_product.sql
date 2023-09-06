CREATE TRIGGER product_delete_trigger
BEFORE DELETE ON product
FOR EACH ROW
BEGIN
    DECLARE pid_deleted INT;
    SET pid_deleted = OLD.id;

    -- Check if there are any orders with this product that are not 'Inbound'
    IF EXISTS (
        SELECT order_id
        FROM order_item oi JOIN order_details od ON oi.order_id = od.id
        WHERE oi.product_id = pid_deleted
        AND od.status = 'Inbound' LIMIT 1
    ) THEN
        -- If there are 'Inbound' orders, raise an error or perform other desired actions
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete: There exists Inbound orders with this product.';

    ELSE
        -- No 'Inbound' orders, proceed with deletion
        -- Remove all lines with this product_id from order_item
        DELETE FROM order_item WHERE product_id = pid_deleted;
        
        -- Remove all lines from cart_details
        DELETE FROM cart_details WHERE product_id = pid_deleted;

		-- For each (warehouse_id, product_id, quantity), free up the space taken by pid_deleted
        BEGIN
			DECLARE done INT DEFAULT 0;
			DECLARE wid INT;
			DECLARE quant INT;
            -- volume of 1 product item, and total to be freed
            DECLARE volume_of_one DECIMAL(10,2);
            DECLARE cur CURSOR FOR
				SELECT warehouse_id, quantity
				FROM warehouse_item
				WHERE product_id = pid_deleted;
			DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
            -- init volume_of_one
            SELECT (length * width * height) INTO volume_of_one FROM product
            WHERE id = pid_deleted;
            -- loop through warehouse_item; (wid, pid) is unique
			OPEN cur;
			read_loop: LOOP
				FETCH cur INTO wid, quant;
				IF done THEN
					LEAVE read_loop;
				END IF;
				UPDATE warehouse 
                SET remaining_area = remaining_area + volume_of_one * quant
                WHERE id = wid;
            END LOOP;
        END;
        -- Remove all lines with this product_id from warehouse_item
        DELETE FROM warehouse_item WHERE product_id = pid_deleted;
    END IF;
END