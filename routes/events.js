'use strict'

let express = require('express');
let router = express.Router();

/* GET ALL EVENTS - 20 per page. */
router.get('/', (req, res) => {
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
  
  res.render('events/index', { title: 'All Events', events: events});
});

//Event Detail
router.get('/:id', (req, res) => {
  
  let eventDetail = {
	title: "Event Title",
	description: "Event Description",
	date: '2016/12/10'
  };
  
  res.render('events/detail', { title: eventDetail.title, eventDetail: eventDetail });
});

module.exports = router;
