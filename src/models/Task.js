const mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
	name: String,
	type: String,	//1, 2, 3
	location: String,	//SJT, TT, SMV, GDN
	description: String,
	teams: {
		type: [String],
		default: [],
	},	//For storing teams who have this task in ongoing/completed
});

module.exports = mongoose.model("Task", taskSchema);