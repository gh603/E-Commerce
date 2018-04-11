var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    seedDB      = require("./seed"),
    Product  = require("./models/product"),
    User = require("./models/user")
    
 
mongoose.connect("mongodb://localhost/e-commerce");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname));
// app.use(express.static(__dirname + '/views'));

// app.use(express.static(path.join(__dirname, 'views')));
seedDB();


app.use(methodOverride("_method"));
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});



//=================
// Show
//=================

app.get("/", function(req, res){
    res.render("login");
});


//================
// Login / Sign up
//================
app.get("/login", function(req, res){
    res.render("auth");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/products",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/register", function(req, res){
   res.render("register"); 
});


app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
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
app.post("/search", function(req, res){
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
    Comment.findById(req.params.id, function(err, foundProduct){
       if(err){
            res.redirect("back");
       } else {
            // foundProduct.
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

