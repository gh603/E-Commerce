var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
   
   user: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   ],
   date: Date,
   items: [
      {
         quantity: Number,
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product"
      }
   ],
   total: Number
});



module.exports = mongoose.model("Order", orderSchema);