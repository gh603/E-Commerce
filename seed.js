var mongoose = require("mongoose");
var Product = require("./models/product");
var User   = require("./models/user");

var data = [
    
    {
        item: 'Beats Headphone', 
        category: 'Headphone', 
        quantity: 1, 
        image: 'https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738',
        description: 'Immerse yourself in an emotional experience. The Solo2 has a more dynamic, wider range of sound, with a clarity that will bring you closer to what the artist intended. Whether you’re into hip-hop, heavy metal, jazz or electronic, you will feel the higher fidelity sound in your Solo2 . Take control. With the color-matched RemoteTalk cable, you can change songs, adjust the volume and even take calls, without having to reach for your device. (Compatible with iOS devices. Functionality may vary by device', 
        price: 139.99
    }, 
    {
        item: 'iphoneX', 
        category: 'phone',
        quantity: 1,
        image: 'https://www.bell.ca/Styles/wireless/all_languages/all_regions/catalog_images/large/iPhoneX_spgry-en_lrg.png',
        description: 'iPhone x features an all-screen design with a 5.8-Inch super Retina HD display with HDR and true tone. Face ID lets you unlock and use Apple pay with just a glance. Powered by A11 Bionic, the most powerful and smartest chip ever in a smartphone. Supports augmented reality experiences in games and apps.', 
        price: 1299.0,
    }, 
    {
        item: 'Canon EF 75-300mm f/4-5.6 III', 
        category: 'Camera Lens',
        quantity: 1,
        image: 'https://www.grootgadgets.com/wp-content/uploads/2017/03/Canon-70-200mm-Lens-mug-White-replica-groot-gadgets-1-400x400.jpg',
        description: 'This Certified Refurbished product is Manufacturer refurbished, shows limited or no wear, and includes all original accessories plus a 90-day warranty EF Mount Lens Aperture Range: f/4-45 DC Autofocus Motor Minimum Focus Distance: 4.9 58mm Filter Thread Diameter', 
        price: 70.97,
    },
    {
        item: 'Lethato Wingtip Oxford Goodyear Welted Formal Handmade Leather Dress Shoes', 
        category: 'Shoes',
        quantity: 1,
        image: 'https://i.pinimg.com/736x/05/58/c7/0558c796ee706b5cb289ffb68e3b509c--is-the-best-to-the.jpg',
        description: 'Handmade Wingtip Oxford Goodyear Welted Shoes, made of fine quality Calfskin leather. Goodyear welted construction process makes the shoes highly durable, water resistant and comfortable fitting as the leather molds to the foot over time.', 
        price: 130,
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
    User.remove({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("removed users!");
            
            
        }); 
        
    
}
    

module.exports = seedDB;
