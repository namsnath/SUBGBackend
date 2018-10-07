const mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
	name: String,
	type: Number,	//1, 2, 3
	location: String,	//SJT, TT, SMV, GDN
	description: String,
});

module.exports = mongoose.model("Task", taskSchema);