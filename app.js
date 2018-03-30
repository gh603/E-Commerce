var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")
 
mongoose.connect("mongodb://localhost/e-commerce");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 

var userSchema = new mongoose.Schema({
   name: String,
   username: String,
   password: String
});
// var productSchema = new mongoose.Schema({
// 	item: String,
// 	category: String,
// 	price: Number

// });

var User = mongoose.model("User", userSchema);
// var Product = mongoose.model("Product", productSchema);

User.create(
     {
            name: "Allen",
   			username: "Allen888",
   			password: "Allen888"
         
     },
     function(err, user){
      if(err){
          console.log(err);
      } else {
          console.log("NEWLY CREATED USER: ");
          console.log(user);
      }
    });

// Product.create(
//      {
//             item: "Harry Poter",
//    			category: "Book",
//    			price: 25.50
         
//      },
//      function(err, user){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED PRODUCT: ");
//           console.log(user);
//       }
//     });

app.get("/", function(req, res){
    res.render("landing");
});



app.listen(8080, function(){
   console.log("The YelpCamp Server Has Started!");
});

// var http = require('http');

// app.get("/", function(req, res){
//     res.end("landing.ejs");
// });

// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end('Hello World!');
// }).listen(8080);