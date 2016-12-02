
'use strict'

let express = require('express');
let router = express.Router();
import CraftEvent from '../models/craftevent';

/* GET ALL EVENTS - 20 per page. */
router.get('/', (req, res) => {
  
  res.render('admin/dashboard', { title: 'Admin Area'});
});

//NEW EVENT
router.get('/events/new', (req, res) => {
  
  res.render('admin/new_event', { title: 'New Event'});
});

//EDIT  EVENT
router.get('/events/edit/:id', (req, res) => {
  
  res.render('admin/edit_event', { title: 'Edit Event'});
});

//CREATE EVENT
router.post('/events/new', (req, res) => {
	
	const craftevent = req.body.craftevent;
	craftevent.save((err)=>{
		if (err) {
			res.render('/event',{
				success: false,
				message: "Something went wrong"
			});
		}
	    res.redirect('/events');	
	});

});

//UPDATE EVENT
router.post('/events/edit/', (req, res) => {
	
	const craftevent = req.body.craftevent;
	CraftEvent.findOne({}, (err, ce) => {
		if (err) {
			res.render('/events',{
				message: "Event not found"
			})
		};
		craftevent.save((err)=>{
			if (err) {
				res.render('/event',{
					success: false,
					message: "Something went wrong"
				});
			}
			res.redirect('/events');	
		});
	});
});


router.get('/events', (req, res) => {
	
  let events = [
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {	
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  },
	  {
		title: "Event Title",
		description: "Event Description",
		date: '2016/12/10'
	  }
  ]
  res.render('admin/events', { title: 'Events Admin Area', events: events});

});


//Event Detail
router.get('/events/:id', (req, res) => {
  
  let eventDetail = {
	title: "Event Title",
	description: "Event Description",
	date: '2016/12/10'
  };
  
  res.render('events/detail', { title: eventDetail.title, eventDetail: eventDetail });
});

module.exports = router;
