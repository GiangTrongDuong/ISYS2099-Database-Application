from faker import Faker
import csv
import random

# Generate data using Faker
# Specify number of lines in main()

FAKER = Faker()
DATEFORMAT = "%Y-%m-%d %H:%M:%S"
CATEGORY = {
    "Electronics": {
        "id": 1,
        "parent": "none",
        "attribute": "warranty",
        "value": "6 months",
        "required": "True"
    },
    "Phone and Accessories": {
        "id": 2,
        "parent": "Electronics",
        "attribute": "return",
        "value": "1 week",
        "required": "True"
    },
    "Laptop and Computer": {
        "id": 3,
        "parent": "Electronics",
        "attribute": "return",
        "value": "1 month",
        "required": "True"
    },
    "Clothing": {
        "id": 4,
        "parent": "none",
        "attribute": "return",
        "value": "1 week",
        "required": "True"
    },
    "Men's Clothing": {
        "id": 5,
        "parent": "Clothing",
        "attribute": "discount on next purchase",
        "value": "10%",
        "required": "False"
    },
    "Women's Clothing": {
        "id": 6,
        "parent": "Clothing",
        "attribute": "discount on next purchase",
        "value": "15%",
        "required": "True"
    },
}

# Export file names and header
EXPORT = {
    "user":{
        "fn": "./py_data/user.csv",
        "header": ["id","role","user_name","display_name","details","password_hash"]
    },
    "category":{
        "fn": "./py_data/category.csv",
        "header": ["id","category_name","parent_category_id","attribute_name","attribute_value","required"]
    },
    "product":{
        "fn": "./py_data/product.csv",
        "header": ["id","title","seller_id","price","category","length","width","height","image","created_at","updated_at"]
    },
    "warehouse":{
        "fn": "./py_data/warehouse.csv",
        "header": ["id","name","address","total_area","remaining_area"]
    },
    "cart_details":{
        "fn": "./py_data/cart_details.csv",
        "header": ["customer_id","product_id","quantity"]
    },
    "order_details":{
        "fn": "./py_data/order_details.csv",
        "header": ["order_id","customer_id","status","total_price"]
    },
    "order_item":{
        "fn": "./py_data/order_item.csv",
        "header": ["order_id","product_id","quantity"]
    }
}

#TODO: find out the highest id of each data file; set start_from values to the highest value +1
# this should be done automatically

def user(num_rows, start_from = 1):
    with open(EXPORT["user"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["user"]["header"])
        for new_id in range(start_from, num_rows+1):
            uid = new_id
            role = ['customer', 'seller', 'warehouse admin'][random.randint(0,2)]
            user_name = FAKER.unique.word().capitalize() + FAKER.unique.word().capitalize() + str(random.randint(0,1000))
            if role == 'seller':
                display_name = FAKER.unique.company()
                details = FAKER.paragraph() + " Created on: " + FAKER.date() + "." # description on the seller
            elif role == 'customer':
                display_name = FAKER.unique.name()
                details = FAKER.address().replace("\n", ", ") # customer address
            elif role == 'warehouse admin':
                display_name = FAKER.unique.name()
                details = random.randint(1,50) # warehouse id
            password_hash = FAKER.md5()
            # write to csv
            csvw.writerow([uid, role, user_name, display_name, details, password_hash])
            # print to debug
            # print(f"{uid} - {user_name} - {display_name}: {role} \n\t Details: {details} - Password hash: {password_hash}")
    return

def category():
    with open(EXPORT["category"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["category"]["header"])
        for cname in CATEGORY:
            cate = CATEGORY[cname]
            cid = cate["id"]
            parent = cate["parent"]
            attribute = cate["attribute"]
            value = cate["value"]
            required = cate["required"]
            # write to csv
            csvw.writerow([cid, parent, attribute, value, required])
        # print to debug
        # toString = f"""{cid} - {cname}: Child of \"{parent}\" 
        #             {attribute}: {value} - Attribute required: {required}"""
        # print(toString)
    return

def product(num_rows,start_from = 1):
    with open(EXPORT["product"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["product"]["header"])
        for new_id in range(start_from, num_rows+1):
            pid = new_id
            title = FAKER.word(part_of_speech='adjective').capitalize() + " " + FAKER.word(part_of_speech='noun').capitalize() + " MK" + str(random.randint(1,1000))
            seller_id = random.randint(1, 100)
            price = random.randint(1000, 1000000)
            category = list(CATEGORY)[random.randint(0,5)]
            length = random.randint(10,150)
            width = random.randint(10,90)
            height = random.randint(10,150)
            image = FAKER.file_name(category='image')
            created_at = FAKER.date_time().strftime(DATEFORMAT)
            updated_at = FAKER.date_time().strftime(DATEFORMAT)
            # write to csv
            csvw.writerow([pid, title, price, category, length, width, height, image, created_at, updated_at])
            
            # print out to debug
            # toString = f"""{pid} - {title} by seller {seller_id}: 
            #         \t Price: {price}, Category: {category} - Dimension: {length}x{width}x{height} 
            #         \t Image: {image} - Created: {created_at} - Updated: {updated_at}
            # """
            # print(toString)
    return

def warehouse(num_rows, start_from = 1):
    with open(EXPORT["warehouse"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["warehouse"]["header"])
        for new_id in range(start_from, num_rows+1):
            wid = new_id
            name = FAKER.unique.city() + " " + str(random.randint(1,100))
            address = FAKER.address().replace('\n', ', ')
            total_area = random.randint(1000, 12000)
            remaining_area = total_area - random.randint(0, 1000)
            # write to csv
            csvw.writerow([wid, name, address, total_area, remaining_area])
            
            # print out to debug
            # toString = f"""{wid} - {name} at {address}: 
            #         \t Total: {total_area} -- Remaining: {remaining_area}"""
            # print(toString)
        
    return

def cart_details(num_rows, start_from = 1):
    with open(EXPORT["cart_details"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["cart_details"]["header"])
        for row_num in range (start_from, num_rows+1):
            customer_id = row_num
            product_id = random.randint(1,100)
            quantity = random.randint(1,20)
            # write to csv
            csvw.writerow([customer_id, product_id, quantity])
            
            # print to debug
            # toString = f"Row {row_num}: Customer {customer_id}'s cart has {quantity} of item {product_id}"
            # print(toString)
    return

def order_details(num_rows, start_from = 1):
    with open(EXPORT["order_details"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["order_details"]["header"])
        for new_id in range (start_from, num_rows+1):
            order_id = new_id
            customer_id = random.randint(1,100)
            status = ['Accepted', 'Inbound', 'Rejected'][random.randint(0,2)]
            total_price = random.randint(10000,1000000)
            # write to csv
            csvw.writerow([order_id, customer_id, status,total_price])
            
            # print to debug
            # toString = f"Order {order_id} by customer {customer_id} of cost {total_price} is {status}"
            # print(toString)
    return

#TODO: make sure (order_id, product_id) is unique
def order_item(num_rows, start_from = 1):
    with open(EXPORT["order_item"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["order_item"]["header"])
        for row_num in range (start_from, num_rows+1):
            order_id = random.randint(1,100)
            product_id = random.randint(1,100)
            quantity = random.randint(1,20)
            # write to csv
            csvw.writerow([order_id, product_id, quantity])
            
            # print to debug
            # toString = f"Row {row_num}: Order {order_id} has {quantity} of item {product_id}"
            # print(toString)
    return

def main():
    user(50)
    product(150)
    category()
    warehouse(20)
    cart_details(100)
    order_details(100)
    order_item(100)
    return 0

main()