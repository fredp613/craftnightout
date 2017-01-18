'use strict'

var express = require('express');
var router = express.Router();
import HostEvent from "../models/hostevent";


router.get('/', (req, res)=>{	
	res.render('eventhostings/index', {title: "Host an Event",layout:'other.handlebars'});
})
router.get('/new/:type', (req, res)=>{	
	console.log(req.params.type);
	if (req.params.type=="eatery") {
		res.render('eventhostings/new', {title: "Host an Event",layout:'other.handlebars', eatery:true,csrfToken: req.csrfToken()});
	} else if (req.params.type =="crafter" ) {
		res.render('eventhostings/new', {title: "Host an Event",layout:'other.handlebars', crafter:true,csrfToken: req.csrfToken()});
	} else {
		res.render('eventhostings/new', {title: "Host an Event",layout:'other.handlebars', privateEvent:true,csrfToken: req.csrfToken()});

	}
})
router.post('/create', function(req, res) {
	let hostevent = new HostEvent(req.body);	
	hostevent.save((err)=>{
		if (err) {
			res.render('eventhostings/new', {title: "Host an Event",layout:'other.handlebars', privateEvent:true,csrfToken: req.csrfToken()});
		} else {
			res.redirect("/");
		}
	});

})



module.exports = router;
