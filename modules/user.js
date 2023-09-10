const express = require('express');
const bcrypt = require('bcrypt');
const { LOGIN_ROUTE, SIGNUP_ROUTE, MY_ACCOUNT_ROUTE } = require('../constants');
const database = require('../models/connection/dbSqlConnect');
const Category = require('../models/mongodb/models/function_category');
const router = express.Router();
const isAuth = require("../models/isAuth");
const insertDB = require('../models/function_user');

//session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

var root = './user'; //root folder to pages

//router dependencies
router.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET", "POST"],
  credentials: true
}));

// full route to login page: /login
router.get(`${LOGIN_ROUTE}`, async function (req, res) {
  const catlist = await Category.getAllCats(6);
  res.render("layout.ejs", {
    title: "Login",
    bodyFile: `${root}/login`,
    // TODO: add real data - categoryList
    categoryList: catlist,
    // req,
    userSession: req?.session?.user
  })
});

// Verify log in - might want to move query to models/user_authentication
router.post(`${LOGIN_ROUTE}`, async function (req, res) {
  var userName = req.body.username;
  var password = req.body.password;
  database.query(`SELECT id, role, user_name, password_hash 
        FROM user 
        WHERE user_name = ?;`,[userName], (error, uresults) => {
    if (uresults.length > 0) {
      bcrypt.compare(password, uresults[0].password_hash).then(function (result) {
        if (result == true) {
          req.session.user = { role: uresults[0].role, user_name: uresults[0].user_name, id: uresults[0].id };
          req.session.isAuth = true;
          res.redirect("/my-account");
        } else {
          res.redirect("/login");
        }
      });
    } else if (uresults.length <= 0) {
      res.redirect("/login");
    }
  })
})

// full route to signup page: /signup
router.get(`${SIGNUP_ROUTE}`, async (req, res) => {
  const catlist = await Category.getAllCats(6);
  res.render("layout.ejs", {
    title: "Signup",
    bodyFile: `${root}/signup`,
    // TODO: add real data - categoryList
    categoryList: catlist,
    // req: req,
    userSession: req?.session?.user
  });
});

//Verify sign up - might want to move the query to models/user_authentication
router.post(`${SIGNUP_ROUTE}`, async function (req, res) {
  var role = req.body.account;
  var userName = req.body.username;
  var displayName = req.body.displayName;
  var details = req.body.details;
  var password = req.body.password;
  const saltRounds = 10;
  database.query(`SELECT * 
        FROM user 
        WHERE user_name = ?;`,[userName], (error, results) => {
    if (results.length > 0) {
      console.log("Taken username!");
    } else {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        const result = database.query(`
                      INSERT INTO user (role, user_name, display_name, details, password_hash)
                      VALUE (?,?,?,?,?)
                      `, [role, userName, displayName, details, hash]);
        const User = { role: role, user_name: userName };
        res.redirect("/login");
      });
    }
  })
});

// full route to my-account page: /my-account
// set UID here just to test
router.get(`${MY_ACCOUNT_ROUTE}`, isAuth.isAuth, function (req, res) {
  try {
    //why dont we check isAuth right here? if false then redirect to log in
    const userInfo = (req.session.user); //store info to display 
    const userName = userInfo.user_name;
    const role = userInfo.role;
    database.query(`SELECT * 
   FROM user 
   WHERE user_name = ?`,[userName], async (error, result) => {
      if (result) {
        const user_name = result[0].user_name;
        const display_name = result[0].display_name;
        const details = result[0].details;
        const id = result[0].id;
        const catlist = await Category.getAllCats(6);
        //req will be changed based on Nhung proposal

        if (role == "Customer") {
          res.render("layout.ejs", {
            title: "My Account",
            bodyFile: `${root}/my_account`,
            // TODO: add real data - categoryList
            categoryList: catlist,
            userSession: req?.session?.user,
            user_name: user_name,
            display_name: display_name,
            details: details,
            role: "user",
            id: id,
          });
        } else if (role == "Warehouse Admin") {
          res.render("layout.ejs", {
            title: "My Account",
            bodyFile: `${root}/my_account`,
            // TODO: add real data - categoryList
            categoryList: catlist,
            userSession: req?.session?.user,
            user_name: user_name,
            display_name: display_name,
            details: details,
            role: "warehouse",
            id: id,
          });
        } else if (role == "Seller") {
          res.render("layout.ejs", {
            title: "My Account",
            bodyFile: `${root}/my_account`,
            // TODO: add real data - categoryList
            categoryList: catlist,
            userSession: req?.session?.user,
            user_name: user_name,
            display_name: display_name,
            details: details,
            role: "seller",
            id: id,
          });
        }

      } else {
        console.log("error finding user from database");
        // render error page
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post(`/update-user-info`, isAuth.isAuth, async (req, res) => {
  try {
    const info = req.session.user;
    const id = info.id;
    const user_name = req.body.user_name;
    const display = req.body.display_name;
    const detail = req.body.details;
    await insertDB.updateUser(id, user_name, display, detail);
    res.redirect("/my-account");
  } catch (err) {
    console.log(err);
  }
})

router.post(`${MY_ACCOUNT_ROUTE}/delete-user/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.body.role;
    await insertDB.deleteUser(id, role);
    // res.send("User deleted");
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;