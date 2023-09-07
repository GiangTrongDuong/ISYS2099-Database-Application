-- place order using transaction
-- output the cost of pid * quantity 

DROP PROCEDURE IF EXISTS order_trans;
CREATE PROCEDURE order_trans(
-- take in the order id, product id, quantity; return the cost of product * quantity
-- an entry in order_details is already created
    IN oid INT,
    IN pid INT,
    IN quant INT,
    OUT cost INT
)
BEGIN
    DECLARE availableStock INT;

    -- Start a transaction
    START TRANSACTION;

    -- Check the available stock for the product
    SELECT remaining INTO availableStock
    FROM product
    WHERE id = pid;

    -- If there is sufficient stock, proceed with the order
    IF availableStock >= quant THEN
        -- Deduct the ordered quantity from the product stock
        UPDATE product
        SET remaining = remaining - quant
        WHERE id = pid;

        -- Calculate the total price for the order - this will be returned
        SET cost = quant * (SELECT price FROM product WHERE id = pid);

        -- Add order items to the order
        INSERT INTO order_item (order_id, product_id, quantity)
        VALUES (oid, pid, quant);
		SELECT 'Product is placed successfully.' as result;
        -- Commit the transaction
        COMMIT;
    ELSE
        -- If there is insufficient stock, roll back the transaction
        ROLLBACK;

        -- Return an error message
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient stock for the requested quantity.';
    END IF;
END
