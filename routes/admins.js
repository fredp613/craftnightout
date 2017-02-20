'use strict'

let express = require('express');
let router = express.Router();

import CraftEvent from '../models/craftevent';
import EventCategory from '../models/eventcategory';
import Subscriber from '../models/subscriber';
import HostEvent from '../models/hostevent';
import moment from "moment";


/* GET ALL EVENTS - 20 per page. */
router.get('/', (req, res) => {
  res.render('admins/index', { layout: 'admin.handlebars' });
});

router.get('/eventcategories', (req, res)=>{
	EventCategory
		.find({})
		.exec((err, docs)=>{
		    res.render('admins/eventcategories/index', { title: 'Event Categories', eventcategories: docs, layout: "admin.handlebars"});
		});
});
router.get('/eventcategories/new', (req, res)=>{
	res.render('admins/eventcategories/new', {title: "New Event Category", layout:"admin.handlebars"/**csrfToken: req.csrfToken()**/})
});
router.post('/eventcategories/create', (req, res) => {
	console.log(req.body)
	delete req.body["_csrf"];
	let eventcategory = new EventCategory(req.body);	
	
	eventcategory.save((err)=>{
		if (err) {
			res.render('admins/eventcategories/new', {title:"new event category", layout:"admin.handlebars"/**csrfToken: req.csrfToken()**/})
		} else {
			res.redirect('/admins/eventcategories');

		}
	});
	

});
router.get('/eventcategories/edit/:id', (req, res) => {
	EventCategory.findOne({_id:req.params.id}, (err, doc) => {
		console.log(doc)
		if (err) {
			res.render('/eventcategories',{
				message: "Event Category not found",
				layout: "admin.handlebars"
			})
		} else {
  			res.render('admins/eventcategories/edit', { title: 'Edit Event Category',layout:'admin.handlebars'/**,csrfToken: req.csrfToken()**/,eventcategory:doc});
		}
	});

});
router.post('/eventcategories/update', (req, res) => {
	
delete req.body["_csrf"];
	EventCategory.findOneAndUpdate({_id:req.body._id}, req.body, {upsert:false}, (err,doc)=>{
		if (err) {
			res.render('/eventcategories/edit/'+req.body._id,{
				message: "something went wrong",
				layout: "admin.handlebars"
			})

		} else {
			res.redirect("/admins/eventcategories");
		}
	});	
	
});

router.get('/eventcategories/destroy/:id', (req, res) => {
	let eventCategoryId = req.params.id;
	EventCategory.findOneAndRemove({_id:eventCategoryId}, function(err) {
			res.redirect("/admins/eventcategories")
	});
});

//NEW EVENT
router.get('/evts/new', (req, res) => {
	EventCategory.find({}, (err, docs) => {
  		res.render('admins/evts/new', { title: 'New Event', layout: 'admin.handlebars', eventCategories:docs /**csrfToken: req.csrfToken()**/});

	});
});
//let upload = multer({
//	dest: "./user_images",
//});

//CREATE EVENT
router.post('/evts/create', (req, res) => {
	if (!req.body.isPrivate) {
		req.body.isPrivate = false;
	}
	let craftevent = new CraftEvent(req.body);	
	craftevent.imgId = req.file.filename.toString();
	craftevent.save((err)=>{
		if (err) {
			res.render('admins/evts/new', {title:"new event", layout:"admin.handlebars" /**csrfToken: req.csrfToken()**/})
		} else {
			res.redirect('/admins/evts');
		}
	});
	

});

//EDIT  EVENT
router.get('/evts/edit/:id', (req, res) => {
	CraftEvent.findOne({_id:req.params.id}, (err, doc) => {
		let isoDate = doc.eventDate.toISOString();
	    console.log(isoDate);	
		let utcDate = new Date(doc.eventDate.getUTCFullYear(),doc.eventDate.getUTCMonth(),doc.eventDate.getUTCDate());
		let formattedDate = moment(utcDate).format("YYYY-MM-DD");
		console.log(isoDate);
		if (err) {
			res.render('/evts',{
				message: "Event not found",
				layout: "admin.handlebars"
			})
		} else {
			EventCategory.find({}, (err1, docs)=>{
		res.render('admins/evts/edit', { title: 'Edit Event',layout:'admin.handlebars',/**csrfToken: req.csrfToken()**/ formattedDate: formattedDate, craftevent:doc, eventCategories: docs });
			});
		}
	});
});
//UPdate event
router.post('/evts/update', (req, res) => {
	if (!req.body.isPrivate) {
		req.body.isPrivate = false;
	}
	let craftevent = req.body;
	craftevent.imgId = req.file.filename.toString();
	CraftEvent.findOneAndUpdate({_id:req.body._id}, craftevent, {upsert:false}, (err,doc)=>{
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
	
  	//CraftEvent.find({}, (err, docs)=>{
	//	if (docs === null || docs === undefined) {
	//	    res.render('admins/evts/index', { title: 'Events Admin Area', events: null, layout: "admin.handlebars"});
	//	} else {
	//		res.render('admins/evts/index', { title: 'Events Admin Area', events: docs, layout: "admin.handlebars"});
	//	}
	//})
	CraftEvent
		.find({})
		.sort({eventDate: 1})
		.exec((err, docs)=>{
		    res.render('admins/evts/index', { title: 'Events Admin Area', events: docs, layout: "admin.handlebars"});
		});


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
router.get('/subscribers/destroy/:id', (req, res) => {
	let subId = req.params.id;
	Subscriber.findOneAndRemove({_id:subId}, function(err) {
			res.redirect("/admins/subscribers")
	});
});
//router.get('/subscribers/update/:id/:newEmail', (req, res) => {
//	Subscriber.findOneAndUpdate({_id:req.params.id},{$set: {email:req.params.newEmail}}, {upsert:true}, (err) =>{
//		res.redirect("/admins/subscribers");
//	})
//});
router.get('/staging', (req, res) => {
	let d = new Date(Date.now());
	let utcDate = new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());
	CraftEvent
		.find({isPrivate:null,isPrivate:false,eventType:"Cardmaking", eventDate: {$gte: utcDate}})
		.limit(10)
		.sort({eventDate: 1})
		.exec((err, docs)=>{
			CraftEvent.find().distinct('eventType', (err, eventTypes)=> {
					let sortedEvents = eventTypes.sort();
					res.render('admins/staging', { title: 'Craft Night Out',layout:'main.handlebars',events:docs, eventTypes: sortedEvents,selectedEventType:"Cardmaking"/**, csrfToken: req.csrfToken()**/});
				
			})
		});
});

router.get('/hostevents', (req, res)=> {
	HostEvent.find({}, (err, docs)=>{
		res.render('admins/hostevents/index', { title: 'Host events Admin Area', hostevents: docs, layout: "admin.handlebars"});
	})

});
router.get('/hostevents/:id', (req, res) => {
  HostEvent.findOne({"_id":req.params.id}, (err, doc)=>{
		if (err) {
			return res.render('admins/hostevents/detail', {title: "Not Found",detail: null,actioned:null, layout: "admin.handlebars"/**,csrfToken: req.csrfToken()**/ });
		} else {
			if (doc === null || doc === undefined) {
				return res.render('admins/hostevents/detail', {title: "Not Found",detail: null,actioned:null, layout: "admin.handlebars"/**,csrfToken: req.csrfToken()**/});
			} else {
				if (doc.actioned) {
				return res.render('admins/hostevents/detail', {title: doc.title,detail: doc,actionRequired:false, layout: "admin.handlebars"/**,csrfToken: req.csrfToken()**/});
				}
				return res.render('admins/hostevents/detail', {title: doc.title,detail: doc,actionRequired:true, layout: "admin.handlebars"/**,csrfToken: req.csrfToken()**/});

			}
		}
  }) 
  
});
router.post('/hostevents/update', (req, res) => {
	
delete req.body["_csrf"];
	let hostEvent = req.body;
	//hostEvent.actionedOn = Date();
	hostEvent.actioned = true;
	console.log(hostEvent);
	HostEvent.findOneAndUpdate({_id:req.body._id}, hostEvent, {upsert:false}, (err,doc)=>{
		if (err) {
			res.render('/hostevents/'+req.body._id,{
				message: "something went wrong",
				layout: "admin.handlebars"
			})

		} else {
			res.redirect("/admins/hostevents");
		}
	});	
	
});



module.exports = router;
