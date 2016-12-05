'use strict'

var express = require('express');
var router = express.Router();
import CraftEvent from "../models/craftevent";
/* GET home page. */
router.get('/', function(req, res) {
	
	CraftEvent
		.find({})
		.limit(4)
		.exec((err, docs)=>{
			res.render('index', { title: 'Craft Night Out',layout:'main.handlebars', featuredEvents: docs});
		});  
		


});

module.exports = router;
