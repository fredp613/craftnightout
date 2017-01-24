'use strict'

import mongoose from "mongoose"

let Schema = mongoose.Schema;


const HostingAccount = new mongoose.Schema({
	title: String,
	website: String,
	description: String,
});
export default mongoose.model('HostingAccount',HostingAccount);
