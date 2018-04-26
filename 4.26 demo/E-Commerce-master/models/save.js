var mongoose = require("mongoose");

var saveSchema = new mongoose.Schema({
   
   user: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   ],
   
   items: [
      {
         
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product"
      }
   ]

});



module.exports = mongoose.model("Order", orderSchema);