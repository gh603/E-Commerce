var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    seedDB      = require("./seed"),
    Product  = require("./models/product")
    // http = require("http"),
    // fs = require("fs")
 
mongoose.connect("mongodb://localhost/e-commerce");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname));
// app.use(express.static(__dirname + '/views'));

// app.use(express.static(path.join(__dirname, 'views')));
seedDB();






//=================
// Show
//=================
// app.get("/", function(req, res){
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     fs.readFile('./views/index.html', function(err, data){
//       if(err){
//         console.log(err);
//       }else{
//         res.write(data);
//       }
//       res.end();  
//     })
// });
app.get("/", function(req, res){
    res.render("homepage");
});


//================
// Homepage
//================
app.get("/login", function(req, res){
    res.render("auth");
});

//================
// Show products
//================
app.get("/products",function(req, res){
  Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("index",{products:allProducts});
       }
    });
});



//================
// Search
//================
router.post("/", function(req, res){
    // Get all techs from DB
    var item = req.body.itemName;
    Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("search",{products:allProducts, item: item});
       }
    });
});


//================
// Add
//================


//CREATE - add new campground to DB
app.post("/products", function(req, res){
    // get data from form and add to products array
    var name = req.body.item;
    var category = req.body.category;
    var quantity = req.body.quantity;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;

    var newProduct = {item: name, category: category, quantity: quantity, 
      image: image, description: desc, price: price}
    // Create a new campground and save to DB
    Product.create(newProduct, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
           
            res.redirect("/products");
        }
    });
});
//================
// Show certain product detail
//================
app.get("/products/:id", function(req, res){
    //find the campground with provided ID
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            console.log(foundProduct)
            
            res.render("campgrounds/show", {product: foundProduct});
        }
    });
});

//================
// Delete
//================
app.delete("/products/:id", function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("products");
       }
    });
});

//=================
// Authentication
//=================

app.listen(8080, function(){
   console.log("The E-commerce Server Has Started!");
});

