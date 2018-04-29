var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
	item: String,
	category: String,
   	image: String,
   	description: String,
	price: Number,
	quantity: Number,
	isDeleted: Boolean
});



module.exports = mongoose.model("Product", productSchema);