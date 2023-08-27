const express = require('express');
const router = express.Router();
const database = require('./database');

router.get("/", function(req, res, next){

	var query = "SELECT * FROM product ORDER BY id";

	database.query(query, function(error, data){

		if(error)
		{
			throw error; 
		}
		else
		{
			response.render('index', {title:'Test gen', sampleData:data});
		}

	});

});

module.exports = router;
