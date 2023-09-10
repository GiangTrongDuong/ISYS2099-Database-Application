const express = require('express');
const { WAREHOUSE_ROUTE, WAREHOUSE_MOVE_PRODUCT } = require('../constants');
const Category = require('../models/mongodb/models/function_category');
const router = express.Router();
const db = require('../models/function_warehouse');
const userDb = require('../models/function_user');
const isAuth = require('../models/isAuth');

let root = `.${WAREHOUSE_ROUTE}`;

//session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(cors({
  origin: ["http://localhost:3000"],
  method: ["GET", "POST"],
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//end-of session

// Show all warehouses for admin to check and navigate
router.get(`${WAREHOUSE_ROUTE}/all`, isAuth.isAuth, async (req, res) => {
  try {
    const catlist = await Category.getAllCats(6);
    const all_wh = await db.warehouse_show_all(); //store info to display 
    res.render('layout.ejs',{
      title: "Warehouse",
      bodyFile: `${root}/warehouse`,
      categoryList: catlist,
      userSession: req?.session?.user,
      warehouses: all_wh,
    })
  }
  catch (error) {
    res.json(error);
  }

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
router.post(`${WAREHOUSE_ROUTE}/create-warehouse`, async (req, res) => {
  // parse param instead of dummy
  const name = req.body.whname;
  const address = req.body.whaddress;
  const area = req.body.whtotalae;
  const newWarehouse = {"newName": name, "newAddress": address, "newTotalArea": area}; //store info to display 
  try{
    const message = await db.create_warehouse(newWarehouse);
    res.redirect(`${WAREHOUSE_ROUTE}/all`);
  }
  catch (error) {
    res.json(error);
  }
});




// Show view: a single warehouse
//full route: /warehouse/view?id=123
router.get(`${WAREHOUSE_ROUTE}/view`, isAuth.isAuth, async (req, res) => { // tested: ok
  try{
    const single_wh = await db.read_warehouse(req.query.id); //store info to display 
    const catlist = await Category.getAllCats(6);
    // res.json(single_wh);
    res.render("layout.ejs", {
      title: "My Cart",
      bodyFile: `${root}/warehouse_item`,
      // TODO: add real data - categoryList
      categoryList: catlist,
      userSession: req?.session?.user,
      // TODO: add real data
      warehousesitem: single_wh
    });
  }
  catch (error) {
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
router.post(`${WAREHOUSE_ROUTE}/update-warehouse`, async (req, res) => { //tested: ok
  // parse actual param instead of dummy below
  const whid = req.body.whid;
  const name = req.body.whname;
  const address = req.body.whaddress;
  const newInfo = {"newName": name, "newAddress":address}; //store info to update
  try{
    const message = await db.update_warehouse(whid, newInfo);
    res.redirect(`${WAREHOUSE_ROUTE}/all`);
  }
  catch (error) {
    res.json(error);
  }
});

// delete warehouse with certain wid
// full route: /warehouse/delete?id=123
router.post(`${WAREHOUSE_ROUTE}/delete-warehouse`, async (req, res) => {
  try{
    const whid = req.body.id;
    await db.delete_warehouse(whid);
    res.redirect(`${WAREHOUSE_ROUTE}/all`);
  }
  catch (error){
    res.json(error);
  }

});

// route to get all admins in warehouses
router.get(`${WAREHOUSE_ROUTE}/admins`, async (req, res) => {
  try {
    const catlist = await Category.getAllCats(6);
    const info = req?.session?.user;
    const adminList = await userDb.getUserByRole("Warehouse admin"); //store info to display 
    // res.json(all_admins);
    res.render("layout.ejs", {
      title: "Admins",
      bodyFile: `${root}/warehouse_admins`,
      userSession: info,
      // TODO: add real data - categoryList
      categoryList: catlist,
      adminList: adminList,
    });
  } catch (error) {
    res.send("Error fetching warehouse admin!" + err);
  }
});

// route to interface to move products from 1 warehouse to another
// full route: /warehouse/move?product=123&quantity=456
router.post(`${WAREHOUSE_ROUTE}${WAREHOUSE_MOVE_PRODUCT}`, function (req, res) {
  // Function move_product_to_wh
  const quantity = req.body.quantity;
  const pid = req.body.pid;
  const src_wid = req.body.src_id;
  const dst_wid = req.body.dst_wid;
  const movedItems = db.move_product_to_wh(pid, quantity, src_wid, dst_wid); //store info to display 
  res.json(movedItems);
  });

router.post(`${WAREHOUSE_ROUTE}/move-warehouse`, isAuth.isAuth, async (req, res) => {
  try {
    const pid = req.body.pid;
    const src_wid = req.body.wid;
    console.log(src_wid);
    console.log(pid);
    const catlist = await Category.getAllCats(6);
    const warehouse_data = await db.check_storage(pid);
    // res.json(warehouse_data);
    res.render('layout.ejs', {
      title: "Move product",
      bodyFile: `${root}/warehouse_move`,
      warehouselist: warehouse_data,
      userSession: req?.session?.user,
      categoryList: catlist,
      itemID: pid,
      src_wid: src_wid,
    })
  } catch (err) {
    res.send(err);
  }
})

module.exports = router;