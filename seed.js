var mongoose = require("mongoose");
var Product = require("./models/product");
var User   = require("./models/user");

var data = [
    {
        item: "Harry Poter",
        category: "book",
        price: 30.00
    },
    {
        item: "Iphone X",
        category: "electronics",
        price: 899.00
    },
    {
        item: "Star Wars: The Last Jedi",
        category: "video",
        price: 19.99
    }
]

function seedDB(){
   //Remove all campgrounds
   Product.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed products!");
         //add a few campgrounds
        data.forEach(function(seed){
            Product.create(seed, function(err, product){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a product");
                    //create a comment
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
