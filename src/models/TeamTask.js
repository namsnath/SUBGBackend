const mongoose = require("mongoose");

var teamTaskSchema = new mongoose.Schema({
	teamID: Number,
	taskName: String,
	taskType: Number,	//1, 2, 3
	taskLocation: String,	//SJT, TT, SMV, GDN
	taskStatus: String, //Completed / Ongoing
});

module.exports = mongoose.model("TeamTask", teamTaskSchema);