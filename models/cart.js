var mongoose = require("mongoose");

var cartSchema = new mongoose.Schema({
	userId: String,
	items: [
      {    
        price: Number,
        quantity: Number,
        image: String,
        title: String,
        id: String
      }
   ],

});



module.exports = mongoose.model("Cart", cartSchema);