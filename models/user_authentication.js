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
                    `, [role, userName, displayName, details, values])
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
                }
            });
        } else if (error){
            console.log("No username found");
        }
    })
};

/*Test case
login("DoF","bayleaft");
signUp("Customer","DoF","ZingGiang","He like stuff","bayleaft");*/
login("david23","")
module.exports = {signUp};