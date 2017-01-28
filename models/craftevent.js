'use strict'

import mongoose from "mongoose"

let Schema = mongoose.Schema;

//to do add array for images
const CraftEvent = new mongoose.Schema({
	title: String,
	description: String,
	hostedBy: String,
	locationName: String,
	locationAddress: String,
	locationWebsite: String,
	address: String,
	eventDate:Date,
	eventStartTime: String,
	eventEndTime: String,
	totalTickets: String,
	paypalButton: String,
	isPrivate: Boolean,
    facebook: String,
	instagram: String,	
	eventType: String,
	lat: Number,
	lng: Number
});
export default mongoose.model('CraftEvent', CraftEvent);
