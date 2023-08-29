-- query to see difference between generated remaining_area and actual data
select w.id, w.total_area, w.remaining_area, SUM(p.height * p.width * p.length * wi.quantity) as taken_space,
w.total_area - SUM(p.height * p.width * p.length * wi.quantity) AS should_be_remaining
from warehouse w join warehouse_item wi on w.id = wi.warehouse_id
join product p on p.id = wi.product_id
group by w.id;

-- statement to update 'warehouse' to reflect the above - this is very disruptive! be careful!
UPDATE warehouse
JOIN (
	select w.id as wid, w.total_area, w.remaining_area, SUM(p.height * p.width * p.length * wi.quantity) as taken_space,
	w.total_area - SUM(p.height * p.width * p.length * wi.quantity) AS should_be_remaining
	from warehouse w join warehouse_item wi on w.id = wi.warehouse_id
	join product p on p.id = wi.product_id
	group by w.id
) AS newspec
ON warehouse.id = newspec.wid
SET warehouse.remaining_area = newspec.should_be_remaining;