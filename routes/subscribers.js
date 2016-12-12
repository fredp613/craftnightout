
'use strict'

let express = require('express');
let router = express.Router();

import Subscriber from '../models/subscriber';

router.get('/new', (req, res) => {
	res.render('subscribers/new', { title: 'New Subscriber', layout: 'other.handlebars', csrfToken: req.csrfToken()});
});

router.post('/create', (req, res) => {
	
	console.log(req.body)
	delete req.body["_csrf"];
	console.log(req.body)
	let subscriber = new Subscriber(req.body);
	subscriber.createdOn = new Date();
	subscriber.save((err)=>{
		if (err) {
			res.render('subscribers/new', { title: 'New Subscriber', layout: 'other.handlebars', message: "Something went wrong try again", error: true, csrfToken: req.csrfToken()});
		} else {
			res.render('subscribers/new', { title: 'New Subscriber', layout: 'other.handlebars', message: "Thank you for subscribing!", error: false});
		}
	});
});


module.exports = router;
