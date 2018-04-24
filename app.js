
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    filter = require('lodash.filter'),
    seedDB = require("./seed"),
    Product = require("./models/product"),
    User = require("./models/user"),
    Cart = require("./models/cart"),
    Order = require("./models/order")

mongoose.connect("mongodb://localhost/e-commerce");
app.use(bodyParser.urlencoded({ extended: true }));
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
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password', }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//=================
// Show
//=================

app.get("/", function (req, res) {
    res.render("auth");
});


//=================
// Authentication
//=================
app.get("/login", function (req, res) {
    res.render("auth");
});

app.post("/login", passport.authenticate("local",
    {

        successRedirect: "/items",
        failureRedirect: "/login"
    }), function (req, res) {
    });




app.post("/signup", function (req, res) {
    // var newUser = new User({username: req.body.Email, FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email });
    var newUser = new User({ username: req.body.email, fname: req.body.fname, lname: req.body.lname, email: req.body.email, isManager: true });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {

            console.log(err);
            return res.render("auth");
        }
        passport.authenticate("local")(req, res, function () {

            console.log(newUser);
            var newCart = { userId: req.user._id, items:[]}
            Cart.create(newCart, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(newlyCreated);
                }
            });
            res.redirect("/items");
        });
    });
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/items");
});
//================
// Manager
//================

app.get("/manage", function (req, res) {
    res.render("manage");
});

app.get("/login", function (req, res) {

    res.render("auth");
});
//================
// Show products
//================
app.get("/items",isLoggedIn, function (req, res) {
    Product.find({}, function (err, allProducts) {
        if (err) {
            console.log(err);
        } else {
            //    console.log(allProducts);
            res.render("index", { products: allProducts });
        }
    });
});

//================
// Show filtered product detail
//================
// app.get("/items", function (req, res) {
//     //find all products
//     Product.find({}, function (err, allProducts) {
//         if (err) {
//             console.log(err);
//         } else {
//             //filter
//             var filterProduct = lodash.filter(allProducts, x => x.category === 'Headphone');
//             res.render("index", { filterproducts: filterProduct });
//         }
//     });
// });

//================
// Order
//================

app.get("/orders", isLoggedIn, function (req, res) {
    console.log('GET: orders');
    Order.find({ userId: req.user._id }, function (err, allOrders) {
        // Order.find({ userId: 'gehui603@gmail.com' }, function (err, allOrders) {
        if (err) {
            console.log(err);
        } else {
            console.log(allOrders);
            res.render("orders", { orders: allOrders });
        }
    });
});

//================
// Checkout
//================

app.post("/orders", isLoggedIn, function (req, res) {
    console.log('POST: orders');
    Cart.find({ userId: req.user._id }, function (err, foundCart) {
        if (err) {
            console.log(err);
        } else {
            var newOrder = { userId: req.user._id, date: new Date(), items: foundCart.items, total: foundCart.total };
            Order.create(newOrder, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(newlyCreated);
                    res.redirect("/items");
                }
            });
        }
    });
});
//================
// Cart
//================

app.get("/cart", isLoggedIn, function (req, res) {
    console.log("GET: cart"); 
    Cart.findOne({ userId: req.user._id }, function (err, foundCart) {
        if (err) {
            console.log(err);
        } else {
            res.render("cart", { carts: foundCart });
        }
    });
});

app.post("/cart/:id", isLoggedIn, function (req, res) {
    console.log("POST: cart");
    
    Cart.findOne({userId: req.user._id }, function (err, foundCart) {
        if (err) {
            //console.log(err);
        } else {
            Product.findById(req.params.id, function (err, foundProduct) {
                if (err) {
                    console.log(err);
                } else {
                    var item = { title: foundProduct.item, id: req.params.id, price: foundProduct.price, image: foundProduct.image};
                    foundCart.items.push(item);
                    foundCart.save();
                    console.log(foundCart);
                    res.redirect("/items");
                }
            });
        }
    });
});

app.delete("/cart/:id", isLoggedIn, function(req, res){
    console.log(req.params.id);
    Cart.findOne({userId: req.user._id }, function (err, foundCart){
        if(err){
            console.log(err);
        } else {
            foundCart.items.pull({_id: req.params.id });
            foundCart.save(); 
            console.log("DELETE: cart"); 
        }
      });
   // Cart.update( {userId: req.user._id }, { $pull: {id: [req.params.id] } } );
    
});



//================
// Search
//================
app.post("/search", function (req, res) {
    // Get all items from DB
    console.log("POST: search"); 
    var keyWord = req.body.itemName;
    console.log(keyWord);
    Product.find({ item: keyWord }, function (err, allProducts) {
        if (err) {
            console.log(err);
        } else {
            console.log(allProducts);
            //   res.send({products: allProducts}); 
            res.render("index", { products: allProducts });
        }
    });
});


//================
// Add
//================


//CREATE - add new item to DB
app.post("/items", isAdmin, function (req, res) {
    // get data from form and add to products array
    var name = req.body.item;
    var category = req.body.category;
    var quantity = req.body.quantity;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;

    var newProduct = {
        item: name, category: category, quantity: quantity,
        image: image, description: desc, price: price
    }
    // Create a new campground and save to DB
    Product.create(newProduct, function (err, newlyCreated) {
        if (err) {
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
app.get("/items/:id", function (req, res) {
    //find the product with provided ID
    Product.findById(req.params.id, function (err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundProduct)

            res.render("products", { products: foundProduct });
        }
    });
});
//================
// Update
//================

app.put("/:id", isAdmin, function (req, res) {
    // find and update the correct campground
    Product.findByIdAndUpdate(req.params.id, req.body.product, function (err, updatedProduct) {
        if (err) {
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
app.delete("/delete", isAdmin, function (req, res) {
    //findByIdAndRemove
    console.log(req.body.id);
    Product.findByIdAndRemove(req.body.id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            // foundProduct.
            res.redirect("/items");
        }
    });
});


// Campground.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/campgrounds");
//       } else {
//           res.redirect("/campgrounds");
//       }
//    });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function isAdmin(req, res, next) {

    if (req.isAuthenticated() && req.user.isManager == true) {
        return next();
    }
    res.redirect("/items");
}


app.listen(8080, function () {
    console.log("The E-commerce Server Has Started!");
});

