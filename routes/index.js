'use strict'

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  let featuredEvents = [1,2,3,4];
  res.render('index', { title: 'Craft Night Out', featuredEvents: featuredEvents });
});

module.exports = router;
