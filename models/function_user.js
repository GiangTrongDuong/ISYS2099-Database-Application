const {connectionCustomer: database} = require('./connection/dbSqlConnect');

// For now, this file is for fetching user data.

const get_user_data = async (uid) => {
    return Promise((resolve, reject) => {
        database.query(`SELECT id, role, user_name, display_name, details
            FROM user WHERE id = ?;`,[uid], (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    });
}

const getUserByRole = async (role) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT id, role, user_name, display_name, details
            FROM user WHERE role = ?;`,[role], (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    });
}

async function updateUser(uid, username, display, details) {
    return new Promise((resolve, reject) => {
        database.query(`UPDATE user 
        SET user_name = ?, display_name = ?, details = ? 
        WHERE id = ?;`,[username, display, details, uid], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

async function deleteUser(uid, role) {
    // delete user 
    return new Promise((resolve, reject) => {
        database.query(`DELETE FROM user WHERE id = ?;`,[uid], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

module.exports = { get_user_data, updateUser, deleteUser, getUserByRole }