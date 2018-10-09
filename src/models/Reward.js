const mongoose = require("mongoose");

var rewardSchema = new mongoose.Schema({
	location: String,
	type: Number,
	resources: Number,
	pollution: Number,
	energy: Number,
});

module.exports = mongoose.model("Reward", rewardSchema);