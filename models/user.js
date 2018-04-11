var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	
	// FirstName: String,
	// LastName: String,
	username: String,
	password: String
	// Email: String
	
});


userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);