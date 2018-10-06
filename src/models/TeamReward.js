const mongoose = require("mongoose");

var teamRewardSchema = new mongoose.Schema({
	teamID: Number,
	location: String,
	name: String,
	type: String,
	points: {
		resources: Number,
		pollution: Number,
		energy: Number,
	},
});

module.exports = mongoose.model("TeamReward", teamRewardSchema);