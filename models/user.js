var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	
	username: String,
	fname: String,
	lname: String,
	email: String,
	password: String,
	isManager: Boolean,
	address : String,
	zipcode: String,
	phone: String
	// Email: String
	
});


userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);