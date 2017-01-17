'use strict'

var express = require('express');
var router = express.Router();



router.post('/create', (req, res) => {
console.log("tst")	
	console.log(req.body)
	res.redirect('https://google.com')
	//delete req.body["_csrf"];
/**	let hostevent = new HostEvent(req.body);	
	hostevent.save((err)=>{
		if (err) {
			res.render('index', { title: 'Craft Night Out',layout:'main.handlebars', featuredEvents: docs, csrfToken: req.csrfToken()});
		} else {
			res.redirect("/");
		}
	});
**/
});

module.exports = router;
