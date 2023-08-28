const express = require('express');
const router = express.Router();
const database = require('./database');

//full route: /read
router.get("/", function(req, res){

	var qy = "SELECT * FROM product ORDER BY id";

	database.query(qy, function(error, data, next){
		if(error) console.log(error);
		else
		{
			res.render('home/index', { error: false, title: "Test gen", sampleData:data});
			// res.json({"data": data});
		}
	});
});


module.exports = router;
