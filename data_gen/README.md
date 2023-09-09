# Please document your changes into change.log 
No one is reading yer commit messages (sorry!)

# Set up
Find or create a ```.env``` file, copy the following, and insert your own info:
```
HOST=''
DB_USER=''
PASSWORD=''
DATABASE=''
```
You may have to create a new database/schema.

This ```.env``` file is in ```.gitignore```.

# Run
Get dependencies ```node install```
Get dependencies ```npm update```

## Add data
### Add MySQL Data
Run via ```node .``` or ```node add_sql_data.js```
### Add MongoDB Data
- Add category: ```npm run importdata:category_mongodb```
- Add product: ```npm run importdata:product_mongodb```

## Run SQL files
You can also copy the contents of the files to your MySQL console and run these chunks.

Run db_create first, then db_inserts

# Other files
- ```create_data.py``` generates CSV files to be used as data
    - ITF: skip CSV altogether and create SQL inserts right away?
- These CSV files are stored in ```py_data/```
