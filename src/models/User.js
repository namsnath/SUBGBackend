const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true,
	},
	GravitasID: {
		type: String, 
		required: true,
	},
	reg_no: String,
	email: String,
	phno: String,
	registered: Boolean
});

module.exports = mongoose.model("User", userSchema);