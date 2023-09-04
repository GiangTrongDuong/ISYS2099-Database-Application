from faker import Faker
import csv
import random

FAKER = Faker()
DATEFORMAT = "%Y-%m-%d %H:%M:%S"

# The categories below are the lowest levels. Products can only be of these categories.
# For complete list of categories (i.e. these + parents), check mongoDB.
CATEGORY = ["Phone", "Phone Accessories", "Computer", "Computer Accessories", 
          "Refridgerator", "Cooker and Oven", "TV", "Lamps",
          "Chairs and Sofas", "Bed", "Wall Decoration", "Floor Decoration",
          "Male Clothing", "Male Accessories", "Boy Clothing and Accessories", "Female Clothing", "Female Accessories", "Girl Clothing and Accessories",
          "Male Sportswear", "Female Sportswear", "Racket Sports", "Ball Sports"]


# Export file names and header
EXPORT = {
    "user":{
        "fn": "./user.csv",
        "header": ["id","role","user_name","display_name","details","password_hash"]
    },
    "category":{
        "fn": "./category.csv",
        "header": ["id","category_name","parent_category_id","attribute_name","attribute_value","required"]
    },
    "product":{
        "fn": "./product.csv",
        "header": ["id","title","seller_id","price","description","category","length","width","height","image","remaining","created_at","updated_at"]
    },
    "warehouse":{
        "fn": "./warehouse.csv",
        "header": ["id","name","address","total_area","remaining_area"]
    },
    "cart_details":{
        "fn": "./cart_details.csv",
        "header": ["customer_id","product_id","quantity"]
    },
    "order_details":{
        "fn": "./order_details.csv",
        "header": ["id","customer_id","status","total_price", "created_at"]
    },
    "order_item":{
        "fn": "./order_item.csv",
        "header": ["order_id","product_id","quantity"]
    },
    "warehouse_item":{
        "fn": "./warehouse_item.csv",
        "header": ["warehouse_id","product_id","quantity"]
    }
}

IMAGE_FILE = './product_image/random_image_urls.txt' # should have 200 lines of image urls
IMG_ARRAY = []
with open (IMAGE_FILE, 'r') as f:
    IMG_ARRAY = f.readlines()

def user(num_rows, start_from = 1):
    # doesn't specify that 1 admin - 1 wh; the below is not tested
    current_wh = 0
    with open(EXPORT["user"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["user"]["header"])
        for new_id in range(start_from, num_rows+1):
            uid = new_id
            role = ['Customer', 'Seller', 'Warehouse Admin'][random.randint(0,2)]
            user_name = FAKER.simple_profile()['username']
            display_name = ""
            details = ""
            if role == 'Seller':
                display_name = FAKER.unique.company()
                details = FAKER.paragraph() + " Created on: " + FAKER.date() + "." # description on the seller
            elif role == 'Customer':
                display_name = FAKER.unique.name()
                details = FAKER.address().replace("\n", ", ") # customer address
            elif role == 'Warehouse Admin':
                display_name = FAKER.unique.name() # warehouse admin's name
                details = current_wh + 1
            password_hash = FAKER.md5()
            # write to csv
            csvw.writerow([uid, role, user_name, display_name, details, password_hash])
            # print to debug
            # print(f"{uid} - {user_name} - {display_name}: {role} \n\t Details: {details} - Password hash: {password_hash}")
    return

# help get descriptive name for product title
def product_first_part(seed):
    # use if else to only generate 1
    if seed == 0:
        return FAKER.color_name()
    elif seed == 1:
        return FAKER.company() + "'s"
    elif seed == 2:
        return FAKER.prefix() + " " + FAKER.last_name() + "'s"
    elif seed == 3:
        return ["Made", "Born"][random.randint(0,1)] + " in " + FAKER.country() + ":"
    return ""

def price_range(price):
    if price < 33000:
        return "a cheap"
    elif price < 66000:
        return "an affordably priced"
    else:
        return "a luxury"

def product(num_rows,start_from = 1):
    sellers = [5,8,11,15,16,23,26,28,33,34,35,38,41,50,51,52,
               55,57,60,62,64,66,67,71,73,74,75,82,84,89,94,95,99,100]
    with open(EXPORT["product"]["fn"], 'w', newline='') as csvfile:
    # with open("sample_product.csv", 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["product"]["header"])
        first_adj = ["color", "company'S", "prefix + name's", "Made/Born in Country"]
        last_adj = ["Edition ", "Gen. ", "MK ", "Version ", "No. ", "Variance ", "Prototype #"]
        for new_id in range(start_from, num_rows+1):
            pid = new_id
            title = (f"{product_first_part(random.randint(0,3))} " # first adj
                     f"{FAKER.word(part_of_speech='adjective').capitalize()} {FAKER.word(part_of_speech='noun').capitalize()} "
                     f"{last_adj[random.randint(0,6)]}{str(random.randint(1,1000))}") # last adj
            seller_id = sellers[random.randint(0, len(sellers) - 1)]
            price = random.randint(1000, 1000000)
            category = CATEGORY[random.randint(0, len(CATEGORY) - 1)] # category name instead of id
            # get some decimals for specs
            length = random.randint(10,500) / 100
            width  = random.randint(10,500) / 100
            height = random.randint(10,500) / 100
            image = IMG_ARRAY[new_id-1].replace('\n', '')
            remaining = random.randint(1, 150)
            date1 = FAKER.date_time()
            date2 = FAKER.date_time()
            created_at = (min(date1, date2)).strftime(DATEFORMAT) + ".000000"
            updated_at = (max(date1, date2)).strftime(DATEFORMAT) + ".000000"
            rt = FAKER.text(max_nb_chars=150).replace("\n", ' ').replace("\t", ' ')
            description = (f"{title} is {price_range(price)} {category.lower()} that cannot be found in your local stores! "
                           f"{rt}")
                        # Backend: 
                        # After the first '!', newline.
                        # Show specs: length, width, height
                        # "Added by <seller link> on <created_at>"
            # write to csv
            csvw.writerow([pid, title, seller_id, price, description, category, length, width, height, image, remaining, created_at, updated_at])
            
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

USER = [6,9,10,12,13,18,19,27,30,32,36,37,42,44,45,48,49,54,56,59,63,65,68,69,79,80,83,85,90,92,93,96,97,98]
def cart_details(start_from = 1):
    with open(EXPORT["cart_details"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["cart_details"]["header"])
        for i in range (start_from - 1, len(USER)):
            customer_id = USER[i]
            # this is a very elementary way to implement weight
            existing = [] # make sure that (customer_id, pid) is unique
            weight = [0,1,1,1,1,1,2,2,2,2,2,3,3,3]
            for i in range(0, weight[random.randint(0, len(weight) - 1)]):
                pid = random.randint(1,200)
                while pid in existing:
                    pid = random.randint(1,100)
                existing.append(pid)
                
                quantity = random.randint(1,20)
                # write to csv
                csvw.writerow([customer_id, pid, quantity])
            
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
            customer_id = USER[random.randint(0,len(USER) - 1)]
            status = ['Accepted', 'Inbound', 'Rejected'][random.randint(0,2)]
            total_price = random.randint(10000,1000000)
            created_at = FAKER.date_time().strftime(DATEFORMAT) + ".000000"
            # write to csv
            csvw.writerow([order_id, customer_id, status,total_price,created_at])
            
            # print to debug
            # toString = f"Order {order_id} by customer {customer_id} of cost {total_price} is {status}"
            # print(toString)
    return

def order_item(num_users, start_from = 1):
    with open(EXPORT["order_item"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["order_item"]["header"])
        for oid in range (start_from, num_users + 1):
            order_id = oid
            weight = [1,1,1,1,1,1,2,2,2,2,2,3]
            existing = [] # make sure that (oid, pid) is unique
            for i in range(0, weight[random.randint(0, len(weight) - 1)]):
                pid = random.randint(1,100)
                while pid in existing:
                    pid = random.randint(1,100)
                existing.append(pid)
                
                quantity = random.randint(1,20)
                # write to csv
                csvw.writerow([order_id, pid, quantity])
            
            # print to debug
            # toString = f"Row {row_num}: Order {order_id} has {quantity} of item {product_id}"
            # print(toString)
    return

def warehouse_item(num_warehouse, start_from=1):
    with open(EXPORT["warehouse_item"]["fn"], 'w', newline='') as csvfile:
        csvw = csv.writer(csvfile)
        csvw.writerow(EXPORT["warehouse_item"]["header"])
        for wid in range(start_from, num_warehouse + 1):
            warehouse_id = wid
            weight = [5,6,7,7,7,7,12,12,12,12,13] # how many items in the warehouse
            existing = [] # (wid, pid) is unique
            for i in range(0, weight[random.randint(0, len(weight) - 1)]):
                pid = random.randint(1,100)
                while pid in existing:
                    pid = random.randint(1,100)
                existing.append(pid)
                
                quantity = random.randint(1,10)
                # write to csv
                csvw.writerow([warehouse_id, pid, quantity])

def main():
    # user(100)
    product(200)
    # category()
    # warehouse(20)
    # cart_details()
    # order_details(100)
    # order_item(100)
    # warehouse_item(20)
    return 0

main()