var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({ 
   userId: String,
   items: [     
       {
         quantity: Number,
         image: String,
         title: String      
      }
   ],
   total: Number
});



module.exports = mongoose.model("Order", orderSchema);