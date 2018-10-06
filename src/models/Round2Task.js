const mongoose = require("mongoose");

var codeSchema = new mongoose.Schema({
	name: String,
	type: String,	//Classic, War
	link: String,	//The URL to challenge
	description: String,
});

module.exports = mongoose.model("Code", codeSchema);