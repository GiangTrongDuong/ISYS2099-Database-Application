DROP TRIGGER IF EXISTS trig_wh_delete;
CREATE TRIGGER trig_wh_delete 
BEFORE DELETE ON warehouse
FOR EACH ROW 
BEGIN
-- this code block runs for every row in the table
	-- find any product that is in the warehouse
    IF EXISTS
		(SELECT warehouse_id 
        FROM warehouse_item 
        WHERE warehouse_id = OLD.id LIMIT 1)
    THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete: This warehouse is still storing items.';
    END IF;
END