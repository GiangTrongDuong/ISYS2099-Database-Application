DROP TRIGGER IF EXISTS customer_update_order;
CREATE TRIGGER customer_update_order
AFTER UPDATE ON `order_details`
FOR EACH ROW
BEGIN
	DECLARE done INT DEFAULT 0;
    -- Check if the order status changed to "Accepted" or "Rejected"
    IF (NEW.status = 'Inbound') AND (OLD.status = 'Inbound') THEN
		SIGNAL SQLSTATE '01000' SET message_text = 'No status change.';
    -- Check if the order status changed to "Accepted" or "Rejected"    
    ELSEIF (NEW.status = 'Accepted' OR NEW.status = 'Rejected') AND (OLD.status = 'Inbound') THEN
		BEGIN
			DECLARE pid INT;
			DECLARE quant INT;	
        -- Cursor to iterate through order_item records for the order; must be inside BEGIN-END
			DECLARE cur CURSOR FOR
			SELECT product_id, quantity
			FROM order_item
			WHERE order_id = NEW.id;

			-- Declare continue handler for the cursor
			DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

			-- Start the cursor loop
			OPEN cur;
			read_loop: LOOP
				FETCH cur INTO pid, quant;

				IF done THEN
					LEAVE read_loop;
				END IF;

				IF NEW.status = 'Accepted' THEN
					-- Call Procedure to free up warehouse space
					CALL free_wh_space(pid, quant);
				-- order is rejected; update product.remaining
				ELSE
					-- Update the product's remaining
					UPDATE product
					SET remaining = remaining + quant
					WHERE id = pid;
				END IF;
			END LOOP;

			-- Close the cursor
			CLOSE cur;
		END;
    ELSE 
		SIGNAL SQLSTATE '45000' SET message_text = 'Your order was not Inbound, or its new status is invalid.';
    END IF;
END