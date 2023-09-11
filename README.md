# ISYS2099-Database-Application
Database application project for course ISYS2099 by group 2, semester 2 2023

View the team members contribution [Here](#contribution)
View the demo link here [Here](#demo-link)

Steps to run:
1. Open terminal in root folder
2. Run `npm install`
3. Follow the [Instruction](#instruction)
4. Read some cautions about frontend [Unhandled In Frontend](#unhandled-in-frontend)
5. If having any bug, please follow [Bugs](#bugs) section.
** Caution: ** To have the best experience, please use Desktop has `width` is at least ***1090px***

# Instruction

## Set up
### To run whole project
- Find or create a ```.env``` file in root, copy the following, and insert your own info:
``` env
HOST='localhost'
DATABASE='testg2'
MONGODB_URI='mongodb+srv://eeet2099group2:eeet2099Pass@databaseapplicationproj.fexqmnq.mongodb.net/?retryWrites=true&w=majority'

DB_USER='root'
PASSWORD='password'

GUEST='guestg2'
GUESTPASSWORD='guestpass'

CUSTOMER='customerg2'
CUSTOMERPASSWORD='userpass'

WAREHOUSE='warehouseg2'
WAREHOUSEPASSWORD='warepass'

SELLER='sellerg2'
SELLERPASSWORD='sellerpass'
```
- Inside .env file:
  - Make sure the `DB_USER`, `PASSWORD`, `HOST` match your root connection in your local. 
  - If you want use another database, make sure change the database name `DATABASE`.
  - You may have to create a new database/schema.
  

## Run
- Open terminal in `root`
### Generate Data
#### Run MySQL add_sql_data.js
This will execute both sql files.

Get dependencies ```node install```

Run via ```node .``` or ```node add_sql_data.js```
#### Run to add data to Mongo
- To add categories: ```npm run importdata:category_mongodb```
- To add products in MongoDB: ```npm run importdata:product_mongodb```
#### Run SQL files
You can also copy the contents of the files to your MySQL console and run these chunks.

Run db_create first, then db_inserts

#### Other files
- ```create_data.py``` generates CSV files to be used as data
    - ITF: skip CSV altogether and create SQL inserts right away?
- These CSV files are stored in ```py_data/```
### Run Whole System
- In the root folder, run `npm install`
- Next, run `npm run start`

# Unhandled In Frontend
Because there are some frontend features the team has not implemented
- If the product list does not exist when filtering, instead of displaying detailed message, it will displays none
- If the frontend page does not word, please check in the terminal or the console to validate the behavior.
# Bugs
- If cannot run due to this error message in terminal `buffering timed out after 10000ms`:
    - Remove `node_moudules`, and `package-lock.json`
    - Make sure the `DB_USER`, `PASSWORD`, `HOST` match your database connection, and the `MONGODB_URI` exists
    - Run `npm install` to install node modules
    - Run `npm run start` to start running the program again
# Contribution
- Ngo Viet Anh: 5pts:
  - SQL Backend
- Tran Mai Nhung: 5pts:
  - Integration
- Giang Trong Duong: 5pts:
  - Security, Integration
- Tran Nguyen Ha Khanh: 5pts:
  - MongoDB

# Demo Link
[Demo Link](https://rmiteduau.sharepoint.com/:v:/s/DatabaseApplicationProjectGroup2/EfaEdboBvZJHjMSBR7DlBbsBdfUOpWyyc0yMau1IApQteA?e=FhAx5P)