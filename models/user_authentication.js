const database = require('./dbSqlConnect');
const bcrypt = require('bcrypt');

async function signUp(role, userName, displayName, details, password){
    const saltRounds = 10;
    database.query(`SELECT * 
        FROM user 
        WHERE user_name = "${userName}";`,(error, results) => {
    if(results.length > 0){
        console.log("Taken username!");
        } else {
            bcrypt.hash(password, saltRounds, function (err, hash){
                const values = hash;
                const result = database.query(`
                    INSERT INTO user (role, user_name, display_name, details, password_hash)
                    VALUE (?,?,?,?,?)
                    `, [role, userName, displayName, details, values]);
                return result;
            });
            
        }
})};

async function login(userName,password){
    database.query(`SELECT password_hash 
        FROM user 
        WHERE user_name = "${userName}";`,(error, results, fields) => {
        if(results.length > 0){
            console.log('User found, checking password');
            bcrypt.compare(password, results[0].password_hash).then(function(result){
                if(result == true){
                    console.log("correct login");
                } else {
                    console.log("incorrect password");
                    console.log(results[0].password_hash);
                }
            });
        } else if (error){
            console.log("No username found");
            return;
        }
    })
};

async function updatePassword(uid, pw) {
    const saltRounds = 10;
    database.query(`SELECT id, password_hash 
        FROM user 
        WHERE id = "${uid}";`,(error, results) => {
        if(results.length > 0){
            console.log('User found, creating password');
            bcrypt.hash(pw, saltRounds, function (err, hash){
                const values = hash;
                const result = database.query(`
                    UPDATE user 
                    SET password_hash = '${values}' 
                    WHERE id = ${uid};`);
                console.log("Set new password for user with id: " + uid);
                const new_pw = database.query(`SELECT password_hash 
                    FROM user WHERE id = ${uid};`, (error, result) => {
                        console.log(`id: ${uid} -- ${result[0].password_hash}`);
                    });
            });
        } else if (error){
            console.log("No username found");
        }
    })
}

/*Test case
login("DoF","bayleaft");
signUp("Customer","DoF","ZingGiang","He like stuff","bayleaft");*/
// login("david23","")
updatePassword(19, "Customer123!"); //user name: dorothy28
updatePassword(1, "Warehouse123!"); //user name: robertsstacy
updatePassword(82, "Seller123!");   //user name: lauraking
// login("dorothy28", "Customer123!");


module.exports = {signUp,login, updatePassword};