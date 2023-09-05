const database = require('./connection/dbSqlConnect');

// For now, this file is for fetching user data.

const get_user_data = async (uid) => {
    return Promise ((resolve, reject) => {
        database.query(`SELECT id, role, user_name, display_name, details
            FROM user WHERE id = ${uid};`, (error, results) => {
                if (error) reject (error);
                else resolve(results);
            })
    });
}

// Should we move user_authentication here?

module.exports = {get_user_data}