'use strict'

let express = require('express');
let router = express.Router();

import CraftEvent from '../models/craftevent';
import Subscriber from '../models/subscriber';


/* GET ALL EVENTS - 20 per page. */
router.get('/', (req, res) => {
  res.render('admins/index', { layout: 'admin.handlebars', });
});

//NEW EVENT
router.get('/evts/new', (req, res) => {
  res.render('admins/evts/new', { title: 'New Event', layout: 'admin.handlebars', csrfToken: req.csrfToken()});
});
//CREATE EVENT
router.post('/evts/create', (req, res) => {
	console.log(req.body)
	delete req.body["_csrf"];
	let craftevent = new CraftEvent(req.body);	
	craftevent.save((err)=>{
		if (err) {
			res.render('admins/evts/new', {title:"new event", layout:"admin.handlebars", csrfToken: csrfToken()})
		} else {
			res.redirect('/admins/evts');

		}
	});
	

});

//EDIT  EVENT
router.get('/evts/edit/:id', (req, res) => {
	CraftEvent.findOne({_id:req.params.id}, (err, doc) => {
		console.log(doc)
		if (err) {
			res.render('/evts',{
				message: "Event not found",
				layout: "admin.handlebars"
			})
		} else {
		let isCardmaking = false;
		if (doc.eventType == "Cardmaking") {
			isCardmaking = true;
		}
  			res.render('admins/evts/edit', { title: 'Edit Event',layout:'admin.handlebars',csrfToken: req.csrfToken(), craftevent:doc, isCardmaking: isCardmaking });
		}
	});

});
//UPdate event
router.post('/evts/update', (req, res) => {
	console.log(req.body)
	delete req.body["_csrf"];
	CraftEvent.findOneAndUpdate({_id:req.body._id}, req.body, {upsert:false}, (err,doc)=>{
		if (err) {
			res.render('/evts/edit/'+req.body._id,{
				message: "something went wrong",
				layout: "admin.handlebars"
			})

		} else {
			res.redirect("/admins/evts");
		}
	});	
	
});


router.get('/evts/destroy/:id', (req, res) => {
	let craftEventId = req.params.id;
	CraftEvent.findOneAndRemove({_id:craftEventId}, function(err) {
			res.redirect("/admins/evts")

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


router.get('/subscribers', (req, res)=> {
	Subscriber.find({}, (err, docs)=>{
	res.render('admins/subscribers', { title: 'Subscribers Admin Area', subscribers: docs, layout: "admin.handlebars"});
	})

});









module.exports = router;
