'use strict'

import mongoose from "mongoose"
import moment from "moment"

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
	imgId: String,
	lat: Number,
	lng: Number
});
CraftEvent.post('find', (result)=>{
	result.forEach((r)=>{
		if (r.description.length > 280) {
			r.description = r.description.substring(0,265) + "...";
			r.ellipsys = true;
		} 
	});
	return result;
});


CraftEvent.post('findOne', (result)=> {
	let formattedDate = moment(result.eventDate).format("YYYY-MM-DD");
	result.eventDate = formattedDate;
	return result;
});
export default mongoose.model('CraftEvent', CraftEvent);
