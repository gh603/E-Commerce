var mongoose = require("mongoose");

var cartSchema = new mongoose.Schema({
	user: 
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   ,
	items: [
      {
         quantity: Number,
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product"
         
      }
   ]
});



module.exports = mongoose.model("Cart", cartSchema);