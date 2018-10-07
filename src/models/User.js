const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true,
	},
	gravitasID: {
		type: String, 
		required: true,
	},
	reg_no: String,
	email: String,
	phone: String,
	registered: {
		type: Boolean,
		default: false,
	}
});

module.exports = mongoose.model("User", userSchema);