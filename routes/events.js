'use strict'

let express = require('express');
let router = express.Router();

import CraftEvent from '../models/craftevent';

/* GET ALL EVENTS - 20 per page. */
router.get('/', (req, res) => {
 
 	CraftEvent.find({}, (err, docs)=> {
		if (docs.count !== null) {
 			res.render('events/index', { title: 'All Events', layout: 'other.handlebars',events: docs});
		} else {
 			res.render('events/index', { title: 'All Events', layout: 'other.handlebars',events: null});
		}
	});

  
});

//Event Detail
router.get('/:id', (req, res) => {
  
  CraftEvent.findOne({"_id":req.params.id}, (err, doc)=>{
		if (doc !== null) {
  			res.render('events/detail', {layout:"other.handlebars", craftevent: doc });
		} else {
  			res.render('events/detail', {layout:"other.handlebars", craftevent: null });

		}
  })
  
});

module.exports = router;
