const express = require('express');
const router = express.Router();
const database = require('./database');

router.get("/", function(request, response, next){

	var query = "SELECT * FROM product ORDER BY id";

	database.query(query, function(error, data){

		if(error)
		{
			throw error; 
		}
		else
		{
			response.render('data', {title:'Node.js MySQL CRUD Application', action:'list', sampleData:data});
		}

	});

});

module.exports = router;
