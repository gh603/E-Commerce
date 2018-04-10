var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
	item: String,
	category: String,
	quantity: Number,
   	image: String,
   	description: String,
	price: Number
});



module.exports = mongoose.model("Product", productSchema);