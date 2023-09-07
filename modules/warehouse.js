const express = require('express');
const { WAREHOUSE_ROUTE, WAREHOUSE_MOVE_PRODUCT } = require('../constants');
const { dummyCatList } = require('../dummyData');
const router = express.Router();
const db = require('../models/function_warehouse');

let root = `.${WAREHOUSE_ROUTE}`;

//session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET","POST"],
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//end-of session

// Show all warehouses for admin to check and navigate
router.get(`${WAREHOUSE_ROUTE}/all`, async (req, res) => {
  try {
    const all_wh = await db.warehouse_show_all(); //store info to display 
    res.json(all_wh);
    // res.render('layout.ejs',{
    //   title: "Warehouse",
    //   bodyFile: `${root}/warehouse`,
    //   categoryList: dummyCatList,
    //   userSession: req?.session?.user,
    //   warehouses: all_wh,
    // })
  }
  catch (error){
    res.json(error);
  }  
    
  // res.render("layout.ejs", {
  //   title: "My Cart",
  //   bodyFile: `${root}/cart`,
  //   // TODO: add real data - categoryList
  //   categoryList: dummyCatList,
  //   userSession: req?.session?.user,
  //   // TODO: add real data
  //   cartItems: cartItems,
  // });
});


// Show view: create warehouse: pass in info {name, address, uid, total_area}
// router.get(`${WAREHOUSE_ROUTE}/create`, function (req, res) {
//   const cartItems = null; //store info to display 
//   // res.render("layout.ejs", {
//   //   title: "My Cart",
//   //   bodyFile: `${root}/cart`,
//   //   // TODO: add real data - categoryList
//   //   categoryList: dummyCatList,
//   //   userSession: req?.session?.user,
//   //   // TODO: add real data
//   //   cartItems: cartItems,
//   // });
// });

// to test: handle warehouse creation (done)
router.post(`${WAREHOUSE_ROUTE}/create`, async (req, res) => {
  // parse param instead of dummy
  const newWarehouse = {"newName": "nw", "newAddress":"123 jjj 123jjjj", "newTotalArea": 123.34}; //store info to display 
  try{
    const message = await db.create_warehouse(newWarehouse);
    res.json(message);
  }
  catch (error){
    res.json(error);
  }
});




// Show view: a single warehouse
//full route: /warehouse/view?id=123
router.get(`${WAREHOUSE_ROUTE}/view`, async (req, res) => { // tested: ok
  try{
    const single_wh = await db.read_warehouse(req.query.id); //store info to display 
    res.json(single_wh);
    // res.render("layout.ejs", {
    //   title: "My Cart",
    //   bodyFile: `${root}/cart`,
    //   // TODO: add real data - categoryList
    //   categoryList: dummyCatList,
    //   userSession: req?.session?.user,
    //   // TODO: add real data
    //   cartItems: cartItems,
    // });
  }
  catch(error){
    res.json(error);
  }
});

// Full route: /warehouse/update?id=123
// Show view: Update warehouse with info {name, address, uid, total_area}
// router.get(`${WAREHOUSE_ROUTE}/update`, function (req, res) {
//   const cartItems = null; //store info to display 
//   // res.render("layout.ejs", {
//   //   title: "My Cart",
//   //   bodyFile: `${root}/cart`,
//   //   // TODO: add real data - categoryList
//   //   categoryList: dummyCatList,
//   //   userSession: req?.session?.user,
//   //   // TODO: add real data
//   //   cartItems: cartItems,
//   // });
// });

// Full route: /warehouse/update?id=123
// Handle warehouse update, navigate accordingly
router.post(`${WAREHOUSE_ROUTE}/update`, async (req, res) => { //tested: ok
  // parse actual param instead of dummy below
  const newInfo = {"newName": "nw", "newAddress":"123 jjj 123jjjj"}; //store info to update
  try{
    const message = await db.update_warehouse(req.query.id, newInfo);
    res.json(message);
  }
  catch (error){
    res.json(error);
  }
  // res.render("layout.ejs", {
  //   title: "My Cart",
  //   bodyFile: `${root}/cart`,
  //   // TODO: add real data - categoryList
  //   categoryList: dummyCatList,
  //   userSession: req?.session?.user,
  //   // TODO: add real data
  //   cartItems: cartItems,
  // });
});

// delete warehouse with certain wid
// full route: /warehouse/delete?id=123
router.get(`${WAREHOUSE_ROUTE}/delete`, async (req, res) => {
  try{
    //const  = db; //store info to display 
    // res.render("layout.ejs", {
    //     title: "My Cart",
    //     bodyFile: `${root}/cart`,
    //     // TODO: add real data - categoryList
    //     categoryList: dummyCatList,
    //     userSession: req?.session?.user,
    //     // TODO: add real data
    //     cartItems: cartItems,
    // });
  }
  catch (error){

  }
  
});

// route to interface to move products from 1 warehouse to another
// full route: /warehouse/move?product=123&quantity=456
router.get(`${WAREHOUSE_ROUTE}/${WAREHOUSE_MOVE_PRODUCT}`, function (req, res) {
  // Function move_product_to_wh
  const cartItems = db.move_product_to_wh(pid, quantity, src_wid, dst_wid); //store info to display 
  // res.render("layout.ejs", {
  //   title: "My Cart",
  //   bodyFile: `${root}/cart`,
  //   // TODO: add real data - categoryList
  //   categoryList: dummyCatList,
  //   userSession: req?.session?.user,
  //   // TODO: add real data
  //   cartItems: cartItems,
  // });
  });

module.exports = router;