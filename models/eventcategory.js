
'use strict'

import mongoose from "mongoose"

let Schema = mongoose.Schema;

const EventCategory = new mongoose.Schema({
	name: String,
});
export default mongoose.model('EventCategory', EventCategory);
