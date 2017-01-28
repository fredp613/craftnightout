'use strict'

var express = require('express');
var router = express.Router();
import CraftEvent from "../models/craftevent";
import HostEvent from "../models/hostevent";
import { sendEmail } from '../helpers/email';
/* GET home page. */
router.get('/', function(req, res) {
	CraftEvent
		.find({eventType: "Cardmaking", isPrivate:null,eventDate: {$gt:Date.now()}})
		.limit(4)
		.sort({eventDate: 1})
		.exec((err, docs)=>{
			CraftEvent
				.find({eventType: "Jewellery", isPrivate:null, eventDate: {$gt:Date.now()}})
				.limit(4)
				.sort({eventDate: 1})
				.exec((err1, docs1)=>{
			res.render('index', { title: 'Craft Night Out',layout:'main.handlebars',cardMakingEvents: docs, jewelleryEvents: docs1, csrfToken: req.csrfToken()});

				});
		});
			
});

router.post('/', function(req, res) {
	let hostevent = new HostEvent(req.body);	
	hostevent.save((err)=>{
		if (err) {
			res.render('index', { title: 'Craft Night Out',layout:'main.handlebars', featuredEvents: docs, csrfToken: req.csrfToken()});
		} else {
			res.redirect("/");
		}
	});

})

module.exports = router;
