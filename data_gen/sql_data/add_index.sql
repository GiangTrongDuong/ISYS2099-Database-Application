
-- table user
create index username_idx on user (user_name); -- use when search by username

-- table warehouse
create index name_idx on warehouse (name); -- use when search warehouse by name
create index remaining_area_idx on warehouse (remaining_area); -- use when select warehouse to put product to -> prioritize area that have more remaining area (use "order by remaining_area")

-- table product
create index title_idx on product (title); -- use when search product by name
create index seller_id_idx on product (seller_id); -- use when query join 2 tables product and user
create index price_idx on product (price); -- use when filter products by price range

-- table cart_details
create index customer_id_idx on cart_details (customer_id); -- use when query to get a customer's cart by the customer_id
create index product_id_idx on cart_details (product_id); -- use when join query with table product

-- table order_details
create index customer_id_idx on order_details (customer_id); -- use when query to get a customer's order by the customer_id
create index created_at_idx on order_details (created_at); -- use when query orders then order them with "order by created_at"

-- table order_item
create index order_id_idx on order_item (order_id); -- use when join query with table order_details to  get the items in an order
create index product_id_idx on order_item (product_id); -- use when join query with table product

-- table warehouse_item
create index warehouse_id_idx on warehouse_item (warehouse_id); -- use when join query with table warehouse
create index product_id_idx on warehouse_item (product_id); -- use when join query with table product
