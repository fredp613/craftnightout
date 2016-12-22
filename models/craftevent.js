'use strict'

import mongoose from "mongoose"

let Schema = mongoose.Schema;


const CraftEvent = new mongoose.Schema({
	title: String,
	description: String,
	locationName: String,
	address: String,
	date: Date,
	totalTickets: String
});
export default mongoose.model('CraftEvent', CraftEvent);
