const express = require('express');
const bcrypt = require('bcrypt');
const { LOGIN_ROUTE, SIGNUP_ROUTE, MY_ACCOUNT_ROUTE } = require('../constants');
const database = require('../models/dbSqlConnect');
const { dummyCatList } = require('../dummyData');
const router = express.Router();


//session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
var root = './user'; //root folder to pages

//router dependencies
router.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET","POST"],
  credentials: true
}));

router.use(cookieParser());
router.use(session({
  key: "username",
  secret: "Group2",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60,
  },
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// full route to login page: /login
router.get(`${LOGIN_ROUTE}`, function (req, res) {
    res.render("layout.ejs", {
      title: "Login",
      bodyFile: `${root}/login`,
      // TODO: add real data - categoryList
      categoryList: dummyCatList,
      req,
    })
});

router.post(`${LOGIN_ROUTE}`, async function (req, res) {
  var userName = req.body.username;
  var password = req.body.password;
  database.query(`SELECT role, user_name, password_hash 
        FROM user 
        WHERE user_name = "${userName}";`,(error, uresults) => {
        if(uresults.length > 0){
            bcrypt.compare(password, uresults[0].password_hash).then(function(result){
                if(result == true){
                    req.session.user = {role: uresults[0].role, user_name: uresults[0].user_name};
                    req.session.isAuth = true;
                    console.log(req.session.isAuth);
                    res.redirect("/my-account");
                } else {
                    res.redirect("/login");
                }
            });
        } else if (uresults.length <= 0){
          res.redirect("/login");
        }
    })
  
})

// full route to signup page: /signup
router.get(`${SIGNUP_ROUTE}`, function (req, res) {
  res.render("layout.ejs", {
    title: "Signup",
    bodyFile: `${root}/signup`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
  });
});

router.post(`${SIGNUP_ROUTE}`, async function (req,res){
  var role = req.body.account;
  var userName = req.body.username;
  var displayName = req.body.displayName;
  var details = req.body.details;
  var password = req.body.password;
  const saltRounds = 10;
  database.query(`SELECT * 
        FROM user 
        WHERE user_name = "${userName}";`,(error, results) => {
        if(results.length > 0){
        console.log("Taken username!");
        } else {
            bcrypt.hash(password, saltRounds, function (err, hash){
                const result = database.query(`
                    INSERT INTO user (role, user_name, display_name, details, password_hash)
                    VALUE (?,?,?,?,?)
                    `, [role, userName, displayName, details, hash]);
                const User = {role: role, user_name: userName};
                req.session.user = User;
                console.log(req.session.user);
                res.redirect("/my-account");
            });
            
        }
})});

// full route to my-account page: /my-account
router.get(`${MY_ACCOUNT_ROUTE}`, function (req, res) {
  const user = null; //store info to display 
  res.render("layout.ejs", {
    title: "My Account",
    bodyFile: `${root}/my_account`,
    // TODO: add real data - categoryList
    categoryList: dummyCatList,
    user: user
  });
});

module.exports = router;