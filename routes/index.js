'use strict'

var express = require('express');
var router = express.Router();
import CraftEvent from "../models/craftevent";
import HostEvent from "../models/hostevent";
import { sendEmail } from '../helpers/email';
/* GET home page. */
router.get('/', function(req, res) {
	let d = new Date(Date.now());
	let utcDate = new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());

	CraftEvent
		.find({isPrivate:null,isPrivate:false, eventDate: {$gte: utcDate}})
		.limit(10)
		.sort({eventDate: 1})
		.exec((err, docs)=>{
			res.render('index', { title: 'Craft Night Out',layout:'main.handlebars',events:docs /**csrfToken: req.csrfToken()**/});
		});
			
});

router.post('/', function(req, res) {
	let hostevent = new HostEvent(req.body);	
	hostevent.save((err)=>{
		if (err) {
			res.render('index', { title: 'Craft Night Out',layout:'main.handlebars', featuredEvents: docs /**csrfToken: req.csrfToken()**/});
		} else {
			res.redirect("/");
		}
	});

})

module.exports = router;
