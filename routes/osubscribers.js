
'use strict'

let express = require('express');
let router = express.Router();

import { sendEmail } from '../helpers/email';
import Subscriber from '../models/subscriber';

router.get('/create/:email', (req, res) => {
	
    Subscriber.findOne({"email":req.params.email}, (err, doc)=>{
      	if (err) {
			return res.json({error: true, doc:null, message: "something went wrong please try again"});
      	} else {
      		if (doc === null || doc === undefined) {
				let subscriber = new Subscriber({email: req.params.email});
				subscriber.createdon = Date();
				subscriber.save((err)=>{
					if (err) {
						return res.json({error: true, doc:null, message: "something went wrong please try again"});
					} else {
						sendEmail("fredp613@gmail.com", 
							"Craft Night Out", "Thank you for registering to our mailing list! You will receive information on new events, fun news and other things crafty! Thanks for supporting local :)  Fay McConnell, Creator and Owner, Craft Night Out")							
						return res.json({error:false, doc:subscriber, message: "Thank you! You will receive an email shortly"});	
					}
				});
      		} else {
				return res.json({error:false, doc:null, message: "You are already subscribed to our mailing list!"});	

      		}
      	}
    }) 
});


module.exports = router;
