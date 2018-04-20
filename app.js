
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    seedDB      = require("./seed"),
    Product  = require("./models/product"),
    User = require("./models/user"),
    Cart = require("./models/cart")
 
mongoose.connect("mongodb://localhost/e-commerce");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname));
// app.use(express.static(__dirname + '/views'));

// app.use(express.static(path.join(__dirname, 'views')));
seedDB();
// seedDB(); //seed the database

app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({usernameField: 'email', passwordField : 'password',},User.authenticate()));
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
    res.render("auth");
});


//=================
// Authentication
//=================
app.get("/login", function(req, res){
    res.render("auth");
});

app.post("/login", passport.authenticate("local", 
    {
        
        successRedirect: "/items",
        failureRedirect: "/login"
    }), function(req, res){
});




app.post("/signup", function(req, res){
    // var newUser = new User({username: req.body.Email, FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email });
    var newUser = new User({username: req.body.email, fname: req.body.fname, lname: req.body.lname, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            
            console.log(err);
            return res.render("auth");
        }
        passport.authenticate("local")(req, res, function(){
         
           console.log(newUser);
           res.redirect("/items"); 
        });
    });
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/items");
});
//================
// Manager
//================

app.get("/manage", function(req, res){
    res.render("manage");
});

app.get("/login", function(req, res){
    res.render("auth");
});
//================
// Show products
//================
app.get("/items",function(req, res){
  Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("index",{products:allProducts});
       }
    });
});

//================
// Order
//================

app.get("/orders",function(req, res){
  Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("orders",{products:allProducts});
       }
    });
});

//================
// Checkout
//================

app.post("/orders",function(req, res){
  Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("orders",{products:allProducts});
       }
    });
});
//================
// Cart
//================

app.get("/cart", isLoggedIn, function(req, res){
  Cart.find({id : req.user._id}).populate("items").exec(function(err, foundCart){
       if(err){
           console.log(err);
       } else {
          console.log(foundCart);
          res.render("cart",{cart:foundCart});
       }
    });
});

app.post("/cart/:id", isLoggedIn ,function(req, res){
  Cart.find({id : req.user._id}, function(err, foundCart){
       if(err){
           console.log(err);
       } else {
          Product.findById(req.params.id, function(err, foundProduct){
            if(err){
              console.log(err);
            } else {
              console.log(foundProduct);
              foundCart.items.push(foundProduct);
              redirect("/cart");
              }
          });
        }
    });
});

//================
// Search
//================
app.get("/search", function(req, res){
    // Get all techs from DB
    var result = req.body.itemName;
    Product.find({item: result}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("index",{products:allProducts});
       }
    });
});


//================
// Add
//================


//CREATE - add new campground to DB
app.post("/items", isAdmin, function(req, res){
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
            console.log(newlyCreated);
            res.redirect("/items");
        }
    });
});
//================
// Show certain product detail
//================
app.get("/items/:id", function(req, res){
    //find the product with provided ID
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            console.log(foundProduct)
            
            res.render("products", {products: foundProduct});
        }
    });
});

//================
// Update
//================

app.put("/:id", isAdmin, function(req, res){
    // find and update the correct campground
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedCampground){
       if(err){
           res.redirect("/items");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});
//================
// Delete
//================
app.delete("/:id", isAdmin, function(req, res){
    //findByIdAndRemove
    Product.findById(req.params.id, function(err, foundProduct){
       if(err){x
            res.redirect("back");
       } else {
            // foundProduct.
            res.redirect("items");
       }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function isAdmin(req,res,next){
  
    if(req.isAuthenticated() && req.user.isManager == true){
        return next();
    }
    res.redirect("/items");
}


app.listen(8080, function(){
   console.log("The E-commerce Server Has Started!");
});

