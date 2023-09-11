DROP TRIGGER IF EXISTS trig_delete_user;

CREATE TRIGGER trig_delete_user 
BEFORE DELETE ON `user`
FOR EACH ROW 
BEGIN
-- this code block runs for every row in the table
    IF (OLD.role = 'Customer') THEN
    -- inbound order -> cannot delete!
		IF EXISTS (SELECT id FROM order_details WHERE status = 'Inbound' AND customer_id = OLD.id) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Cannot delete customer: Some orders are still inbound.';			
		END IF;
        -- delete cart item, order_details, order_item as well - otherwise FK will prevent deletion
        DELETE FROM cart_details WHERE customer_id = OLD.id;
        DELETE FROM order_item WHERE order_id IN (SELECT id FROM order_details WHERE customer_id = OLD.id);
        DELETE FROM order_details WHERE customer_id = OLD.id;
    ELSEIF (OLD.role = 'Seller') THEN
		-- this seller has products in the db -> cannot delete
        IF EXISTS (SELECT id FROM product WHERE seller_id = OLD.id) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Cannot delete seller: Some products by this seller are stored.';
		END IF;
	-- Warehouse admin -> can delete whenever
    END IF;
END