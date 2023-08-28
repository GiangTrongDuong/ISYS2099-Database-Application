create table if not exists user
(
    id            int auto_increment
        primary key,
    role          varchar(50)  not null,
    user_name     varchar(50)  not null,
    display_name  varchar(100) not null,
    details       text         not null,
    password_hash varchar(200) not null,
    constraint user_user_name_uindex
        unique (user_name)
);
create table if not exists warehouse
(
    id             int auto_increment primary key,
    name           varchar(200) not null,
    address        varchar(200) not null,
    total_area     int          not null,
    remaining_area int          not null
);

create table if not exists product
(
    id         int auto_increment primary key,
    title      varchar(200) not null,
    seller_id  int          not null,
    price      int          not null,
    description text NULL,
    category   varchar(200) not null,
    length     int          not null,
    width      int          not null,
    height     int          not null,
    image      text         null,
    created_at datetime     not null,
    updated_at datetime     not null,
    constraint product_user_id_fk
        foreign key (seller_id) references user (id)
);

create table if not exists cart_details
(
    customer_id int not null,
    product_id  int not null,
    quantity    int not null,
    constraint uid_pid
        unique (customer_id, product_id),
    constraint cart_details_product_id_fk
        foreign key (product_id) references product (id),
    constraint cart_details_user_id_fk
        foreign key (customer_id) references user (id)
);

create table if not exists order_details
(
    id          int auto_increment  primary key,
    customer_id int  not null,
    status      text not null,
    total_price int  not null,
    created_at datetime not null,
    constraint order_details_user_id_fk
        foreign key (customer_id) references user (id)
);

create table if not exists order_item
(
    order_id   int not null,
    product_id int not null,
    quantity   int not null,
    constraint oid_pid
        unique (order_id, product_id),
    constraint order_item_order_details_id_fk
        foreign key (order_id) references order_details (id),
    constraint order_item_product_id_fk
        foreign key (product_id) references product (id)
);