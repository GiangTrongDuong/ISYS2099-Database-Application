DROP USER IF EXISTS 'guestg2'@'localhost';
DROP USER IF EXISTS 'customerg2'@'localhost';
DROP USER IF EXISTS 'sellerg2'@'localhost';
DROP USER IF EXISTS 'warehouseg2'@'localhost';

-- Guest priviledge (read only, write for user table)
CREATE USER 'guestg2'@'localhost'
IDENTIFIED BY 'guestpass';

GRANT SELECT
ON testg2.product
TO 'guestg2'@'localhost';

GRANT SELECT,INSERT
ON testg2.user
TO 'guestg2'@'localhost';

-- User Priviledge --
CREATE USER 'customerg2'@'localhost'
IDENTIFIED BY 'userpass';

GRANT SELECT 
ON testg2.product
TO 'customerg2'@'localhost';

GRANT EXECUTE ON PROCEDURE testg2.order_trans TO 'customerg2'@'localhost';
GRANT EXECUTE ON PROCEDURE testg2.free_wh_space TO 'customerg2'@'localhost';

GRANT SELECT, INSERT, UPDATE
ON testg2.user
TO 'customerg2'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE
ON testg2.cart_details
TO 'customerg2'@'localhost';

GRANT SELECT, INSERT, UPDATE
ON testg2.order_details
TO 'customerg2'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE
ON testg2.order_item
TO 'customerg2'@'localhost';

-- Seller
CREATE USER 'sellerg2'@'localhost'
IDENTIFIED BY 'sellerpass';

GRANT EXECUTE ON PROCEDURE testg2.product_to_wh TO 'sellerg2'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE
ON testg2.product
TO 'sellerg2'@'localhost';

    -- insert product into warehouse -> change warehouse storage
GRANT UPDATE
ON testg2.warehouse
TO 'sellerg2'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE
ON testg2.warehouse_item
TO 'sellerg2'@'localhost';

-- Warehouse
CREATE USER 'warehouseg2'@'localhost'
IDENTIFIED BY 'warepass';

GRANT SELECT, INSERT, UPDATE, DELETE
ON testg2.warehouse
TO 'warehouseg2'@'localhost';

GRANT SELECT, UPDATE, DELETE
ON testg2.warehouse_item
TO 'warehouseg2'@'localhost';

GRANT SELECT
ON testg2.product
TO 'warehouseg2'@'localhost';

GRANT EXECUTE ON PROCEDURE testg2.wh_move_product TO 'warehouseg2'@'localhost';