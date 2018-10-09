const mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
	name: String,
	type: Number,	//1, 2, 3
	location: String,	//SJT, TT, SMV, GDN
	description: String,
	ongoingTeams: {
		type: [String],
		default: [],
	},	//For storing teams who have this task in ongoing
	completedTeams: {
		type: [String],
		default: [],
	}, //For storing teams who have this task in completed
	claimedTeams: {
		type: [String],
		default: [],
	},	//For teams who have claimed the task in a reward
	points: Number,	
});

module.exports = mongoose.model("Task", taskSchema);