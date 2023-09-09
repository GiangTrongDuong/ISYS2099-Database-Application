-- move some copies of a product from one warehouse to another
DROP PROCEDURE IF EXISTS wh_move_product;
CREATE PROCEDURE wh_move_product(
    IN pid INT,
    -- quantity of products being moved
    IN quant INT,
    -- source and destination warehouse id
    IN src_wid INT,
    IN dst_wid INT
    
)
BEGIN
	-- quantity of pid in the source warehouse
    DECLARE src_quantity INT;
    -- remaining area and quantity of pid in destination warehouse
    DECLARE dst_remaining DECIMAL(10,2);
    DECLARE dst_quantity INT;
    -- volume of one and all product copies
    DECLARE volume_of_one DECIMAL(10,2);
    DECLARE volume_moved DECIMAL(10,2);

    -- Start a transaction
    START TRANSACTION;
	-- get volume 
    SELECT (length * width * height) INTO volume_of_one FROM product WHERE id = pid;
    SET volume_moved = volume_of_one * quant;
    
    -- Check if there is enough quantity of the product in the source warehouse
    SELECT quantity INTO src_quantity FROM warehouse_item 
    WHERE warehouse_id = src_wid AND product_id = pid;
    -- Check if there is enough space in destination warehouse
    SELECT remaining_area INTO dst_remaining FROM warehouse WHERE id = dst_wid FOR UPDATE;

    IF (dst_remaining >= volume_moved) AND (src_quantity >= quant) THEN
        -- Decrease the volume in the destination warehouse
        UPDATE warehouse
        SET remaining_area = remaining_area - volume_moved
        WHERE id = dst_wid;

        -- Increase the volume in the target warehouse
        UPDATE warehouse
        SET remaining_area = remaining_area + volume_moved
        WHERE id = src_wid;
        
        -- Remove or decrease the quantity in src_wid
        IF src_quantity = quant THEN
			-- equals -> remove
            DELETE FROM warehouse_item WHERE product_id = pid AND warehouse_id = src_wid;
		ELSE 
			-- smaller -> update
			UPDATE warehouse_item SET quantity = quantity - quant
            WHERE product_id = pid AND warehouse_id = src_wid;
		END IF;
        
        -- Add or update the quantity in dst_wid
        SELECT quantity INTO dst_quantity FROM warehouse_item 
        WHERE warehouse_id = dst_wid AND product_id = pid;
        IF dst_quantity IS NOT NULL THEN
			-- quantity exists -> add to it
			UPDATE warehouse_item SET quantity = quantity + quant 
            WHERE warehouse_id = dst_wid AND product_id = pid;
        ELSE
			-- no entry -> create new
            INSERT INTO warehouse_item (warehouse_id, product_id, quantity) 
            VALUE (dst_wid, pid, quant);
        END IF;

        -- Commit the transaction if all updates are successful
        COMMIT;

        SELECT 'Product moved successfully' AS result;
    ELSE
        -- Rollback the transaction if there is insufficient quantity in the destination warehouse
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient quantity in the source warehouse';
    END IF;
END