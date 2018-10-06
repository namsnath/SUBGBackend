const mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
	memberID1: {
		type: String,
		required: true
	},
	memberID2: {
		type: String,
		required: true
	},
	teamID: Number
});

module.exports = mongoose.model("Team", teamSchema);