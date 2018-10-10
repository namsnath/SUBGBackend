const mongoose = require("mongoose");

var roundSchema = new mongoose.Schema({
	round1: Boolean, 
	round2: Boolean,
});

module.exports = mongoose.model("Round", roundSchema);