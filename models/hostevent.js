'use strict'

import mongoose from "mongoose"

let Schema = mongoose.Schema;


const HostEvent = new mongoose.Schema({
	title: String,
	skill: String,
	name: String,
	description: String,
	address: String,
	website: String,
	email: String,
	phone: String,
	comments: String,
	guests: String,
	type: String,
	actioned: Boolean,
	createdOn:Date,
	actionedOn:Date,
});
export default mongoose.model('HostEvent', HostEvent);
