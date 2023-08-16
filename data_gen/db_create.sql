
create table if not exists category
(
    id                 int          not null
        primary key,
    category_name      varchar(50)  not null,
    parent_category_id varchar(50)  null,
    attribute_name     varchar(50)  not null,
    attribute_value    varchar(200) not null,
    required           varchar(50)  not null
);

create table if not exists product
(
    id         int auto_increment
        primary key,
    title      varchar(200) not null,
    seller_id  int          not null,
    price      int          not null,
    category   varchar(200) not null,
    length     int          not null,
    width      int          not null,
    height     int          not null,
    image      text         not null,
    created_at datetime     not null,
    updated_at datetime     not null
);

create table if not exists user
(
    id            int auto_increment
        primary key,
    role          varchar(50)  not null,
    user_name     varchar(50)  not null,
    display_name  varchar(50)  not null,
    details       text         not null,
    password_hash varchar(200) not null,
    constraint user_user_name_uindex
        unique (user_name)
);

create table if not exists warehouse
(
    id             int auto_increment
        primary key,
    name           varchar(200) not null,
    address        varchar(200) not null,
    total_area     int          not null,
    remaining_area int          not null
);

create table if not exists cart_details
(
    customer_id int not null
        primary key,
    product_id  int not null,
    quantity    int not null,
    primary key (product_id, customer_id)
);

create table if not exists order_details
(
    order_id    int auto_increment
        primary key,
    customer_id int  not null,
    status      text not null,
    total_price int  not null
);

create table if not exists order_item
(
    order_id   int not null,
    product_id int not null,
    quantity   int not null,
    primary key (order_id, product_id)
);