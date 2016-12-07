'use strict'

let express = require('express');
let router = express.Router();

import CraftEvent from '../models/craftevent';



/* GET ALL EVENTS - 20 per page. */
router.get('/', (req, res) => {
  res.render('admins/index', { layout: 'admin.handlebars', });
});

//NEW EVENT
router.get('/evts/new', (req, res) => {
  res.render('admins/evts/new', { title: 'New Event', layout: 'admin.handlebars', csrfToken: req.csrfToken()});
});

//EDIT  EVENT
router.get('/evts/edit/:id', (req, res) => {
  
  res.render('admins/evts/edit', { title: 'Edit Event',layout:'admin.handlebars'});
});

//CREATE EVENT
router.post('/evts/create', (req, res) => {
	console.log(req.body)
	delete req.body["_csrf"];
	let craftevent = new CraftEvent(req.body);	
	console.log(craftevent.title);
	craftevent.save((err)=>{
		if (err) {
			res.render('admins/evts/new', {title:"new event", layout:"admin.handlebars", csrfToken: csrfToken()})
		} else {
			res.redirect('/admins/evts');

		}
	});
	

});

//UPdate event
router.post('/evts/edit/', (req, res) => {
	
	const craftevent = req.body.craftevent;
	craftevent.findOne({}, (err, doc) => {
		if (err) {
			res.render('/evts',{
				message: "Event not found",
				layout: "admin.handlebars"
			})
		};

		craftevent.save((err)=>{
			if (err) {
				res.render('/evt',{
					success: false,
					message: "Something went wrong",
					layout: "other.handlebars"
				});
			}
			res.redirect('/evts');	
		});
	});
});


router.get('/evts', (req, res) => {
	
  	CraftEvent.find({}, (err, docs)=>{
		if (docs === null || docs === undefined) {
		    res.render('admins/evts/index', { title: 'Events Admin Area', events: null, layout: "admin.handlebars"});
		} else {
			res.render('admins/evts/index', { title: 'Events Admin Area', events: docs, layout: "admin.handlebars"});
		}
	})

});


//Event Detail
router.get('/evts/:id', (req, res) => {
  CraftEvent.findOne({"_id":req.params.id}, (err, doc)=>{
		if (err) {
			return res.render('admins/evts/detail', {title: "Not Found", eventDetail: null, layout: "admin.handlebars"});
		} else {
			if (doc === null || doc === undefined) {
				return res.render('admins/evts/detail', {title: "Not Found", eventDetail: null, layout: "admin.handlebars"});
			} else {
				return res.render('admins/evts/detail', {title: doc.title, eventDetail: doc, layout: "admin.handlebars"});

			}
		}
  }) 
  
});

module.exports = router;