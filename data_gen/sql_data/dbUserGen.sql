DROP USER IF EXISTS 'guest'@'localhost';
DROP USER IF EXISTS 'customer'@'localhost';
DROP USER IF EXISTS 'seller'@'localhost';
DROP USER IF EXISTS 'warehouse'@'localhost';

-- Guest priviledge (read only, write for user table)
CREATE USER 'guest'@'localhost'
IDENTIFIED BY 'guestpass';

GRANT SELECT
ON testg2.product
TO 'guest'@'localhost';

GRANT SELECT,INSERT
ON testg2.user
TO 'guest'@'localhost';

-- User Priviledge --
CREATE USER 'customer'@'localhost'
IDENTIFIED BY 'userpass';

GRANT SELECT 
ON testg2.product
TO 'customer'@'localhost';

GRANT SELECT, INSERT, UPDATE
ON testg2.user
TO 'customer'@'localhost';

GRANT SELECT, INSERT, UPDATE
ON testg2.user
TO 'customer'@'localhost';

-- Seller
CREATE USER 'seller'@'localhost'
IDENTIFIED BY 'sellerpass';

GRANT SELECT, INSERT, UPDATE
ON testg2.product
TO 'seller'@'localhost';

GRANT INSERT, UPDATE
ON testg2.warehouse
TO 'seller'@'localhost';

-- Warehouse
CREATE USER 'warehouse'@'localhost'
IDENTIFIED BY 'warepass';

GRANT DELETE
ON testg2.warehouse
TO 'warehouse'@'localhost';