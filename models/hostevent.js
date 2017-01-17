'use strict'

import mongoose from "mongoose"

let Schema = mongoose.Schema;


const HostEvent = new mongoose.Schema({
	title: String,
	description: String,
	address: String,
	website: String,
	email: String,
	phone: String,
	comments: String,
	type: String
});
export default mongoose.model('HostEvent', HostEvent);
