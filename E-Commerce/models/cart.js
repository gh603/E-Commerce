var mongoose = require("mongoose");

var cartSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: "User"
	},
	items: [
      {
        quantity: Number,
        itemId: {
			type: mongoose.Schema.Types.ObjectId,
        	ref: "Product"
			}	
      	}
   	],
   	total: Number
});



module.exports = mongoose.model("Cart", cartSchema);