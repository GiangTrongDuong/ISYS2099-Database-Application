# Set up
Create a ```.env``` file, copy the following, and insert your own info:
```
HOST=''
USER=''
PASSWORD=''
DATABASE=''
```
You may have to create a new database/schema.
This ```.env``` file is in ```.gitignore```.

# Run
## Run add_data.js
This will execute both sql files.

Get dependencies ```node install```

Run via ```node .``` or ```node add_sql_data.js```

## Run SQL files
Copy the contents of the files to your MySQL console and run these chunks.

Run db_create first, then db_inserts

# Other files
- ```create_data.py``` generates CSV files to be used as data
    - ITF: skip CSV altogether and create SQL inserts right away?
- These CSV files are stored in ```py_data/```

