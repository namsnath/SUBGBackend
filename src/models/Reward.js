const mongoose = require("mongoose");

var rewardSchema = new mongoose.Schema({
	location: [String],
	type: Number,
	name: String,
	points: Number,
});

module.exports = mongoose.model("Reward", rewardSchema);