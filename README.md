# ISYS2099-Database-Application
Database application project for course ISYS2099 by group 2, semester 2 2023

Steps to run:
1. Open terminal in root folder
2. Run `npm install`
3. Follow the [Instruction](#instruction)
4. If having any bug, please follow [Bugs](#bugs) section.
** Caution: ** To have the best experience, please use Desktop has `width` is ***1090px***
1. Routes:
- Home: http://localhost:3000/
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup

# Instruction

## Set up
Find or create a ```.env``` file in root, copy the following, and insert your own info:
```
HOST=''
DB_USER=''
PASSWORD=''
DATABASE=''
```
You may have to create a new database/schema.

This ```.env``` file is in ```.gitignore```.

## Run
Move to `data_gen` folder by typing `cd data_gen` in terminal from root folder.
### Run add_data.js
This will execute both sql files.

Get dependencies ```node install```

Run via ```node .``` or ```node add_sql_data.js```

### Run SQL files
You can also copy the contents of the files to your MySQL console and run these chunks.

Run db_create first, then db_inserts

### Other files
- ```create_data.py``` generates CSV files to be used as data
    - ITF: skip CSV altogether and create SQL inserts right away?
- These CSV files are stored in ```py_data/```

# Bugs
- If cannot run due to this error message in terminal `buffering timed out after 10000ms`:
    - Remove `node_moudules`, and `package-lock.json`
    - Make sure the `DB_USER`, `PASSWORD`, `HOST` match your database connection, and the `MONGODB_URI` exists
    - Run `npm install` to install node modules
    - Run `npm run start` to start running the program again

- Delete category -> its children also disappear