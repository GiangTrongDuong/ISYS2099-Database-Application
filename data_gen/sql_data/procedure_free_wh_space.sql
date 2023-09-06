DROP PROCEDURE IF EXISTS free_wh_space;

CREATE PROCEDURE free_wh_space(
    IN pid INT,
    IN quant INT
)
BEGIN
    DECLARE volume_of_one DECIMAL(10,2);
    DECLARE volume_freed DECIMAL (10,2);
    -- pick the warehouse to use - choose the one with lowest space
    DECLARE wid INT;
    DECLARE rem_area DECIMAL(10,2);
    
    -- Retrieve product dimensions
    SELECT length * width *height INTO volume_of_one
    FROM product WHERE id = pid;

    -- Calculate the total volume to remove
    SET volume_freed = volume_of_one * quant;

    -- Retrieve the current remaining_area in the warehouse with the least space
    -- This warehouse must be storing the product
    SELECT id, remaining_area INTO wid, rem_area
    FROM warehouse wh, warehouse_item wi 
    WHERE wh.id = wi.warehouse_id AND wi.product_id = pid
    ORDER BY remaining_area ASC LIMIT 1;

	-- Update the remaining_area in the warehouse
	UPDATE warehouse
	SET remaining_area = remaining_area + volume_freed
	WHERE id = wid; 
    -- Update the (wid, pid) pair from warehouse_item
    UPDATE warehouse_item SET quantity = quantity - quant
    WHERE warehouse_id = wid AND product_id = pid;
	
END
