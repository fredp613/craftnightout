
'use strict'

import mongoose from "mongoose"

let Schema = mongoose.Schema;


const Subscriber = new mongoose.Schema({
	email: String,
	fullname: String,
	createdon: Date,
});
export default mongoose.model('Subscriber', Subscriber);