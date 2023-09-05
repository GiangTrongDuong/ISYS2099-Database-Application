-- partition USER TABLE by ROLE
alter table user drop primary key, add primary key (id, role);
alter table user 
partition by list columns (role) (
	partition p_customer values in ('Customer'),
	partition p_seller values in ('Seller'),
	partition p_admin values in ('Warehouse Admin')
);

-- partition ORDER_DEATILS TABLE by STATUS
alter table order_details drop primary key, add primary key (id, status);
alter table order_details 
partition by list columns (stauts) (
	partition p_inbound values in ('Inbound'),
	partition p_accept values in ('Accepted')
	partition p_reject values in ('Rejected')
);

