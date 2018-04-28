
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
    secret: "!",
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
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
    var newUser = new User({ username: req.body.email, fname: req.body.fname, 
        lname: req.body.lname, email: req.body.email, isManager: true, address: req.body.address, phone: req.body.phone, zipcode: req.body.zip });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("auth");
        }
        passport.authenticate("local")(req, res, function () {

            console.log(newUser);
            var newCart = { userId: req.user._id, items: [] }
            Cart.create(newCart, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(newlyCreated);
                }
            });
            
            req.flash("success", "welcome!" );
            res.redirect("/items");
        });
    });
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/items");
});

//================
// Account
//================

app.get("/account", isLoggedIn, function (req, res) {
    User.findById(req.user._id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("account", {user: foundUser});
        }
    })
    
});

//================
// Manager
//================


app.get("/manage", isLoggedIn, function (req, res) {
    var filtercategory = "";
    console.log(req.body);
    var perPage = 10000;
    var page = req.query.page || 1;

    if (filtercategory === '') {
        Product
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, allProducts) {
                if (err) {
                    console.log(err);
                } else {
                    Product.count().exec(function (err, count) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("manage", { products: allProducts, current: page, pages: Math.ceil(count / perPage) });
                        }
                    });
                }
            });
    } else {
        Product
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, allProducts) {
                if (err) {
                    console.log(err);
                } else {
                    var filterProduct = filter(allProducts, x => x.category === filtercategory);
                    res.render("manage", { products: filterProduct, current: page, pages: Math.ceil(filterProduct.length / perPage) });
                }
            });
        }

    });




//================
// Show products with filter function
//================
app.get("/items", isLoggedIn, function (req, res) {
    console.log("GET: items");
    var filtercategory = req.query.cate || '';
    console.log(filtercategory);
    var perPage = 9;
    var page = req.query.page || 1;

    if (filtercategory === '') {
        Product
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, allProducts) {
                if (err) {
                    console.log(err);
                } else {
                    Product.count().exec(function (err, count) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("index", { products: allProducts, current: page, pages: Math.ceil(count / perPage) });
                        }
                    });
                }
            });
    } else {
        Product
            .find({})
            .skip((perPage * page) - perPage)
            // .limit(perPage)
            .exec(function (err, allProducts) {
                if (err) {
                    console.log(err);
                } else {
                    const filterProduct = allProducts.filter(product => product.category === filtercategory); 
                    // var filterProduct = filter(allProducts,
                    //     (x) => {
                    //         console.log(x.category + ' vs. ' + filtercategory + ':'); 
                    //         console.log(x.category === filtercategory); 
                    //         x.category === filtercategory; 
                    //     });
                    console.log(filterProduct.length); 
                    res.render("index", { products: filterProduct, current: page, pages: Math.ceil(filterProduct.length / perPage) });
                }
            });
        }
    });

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
            res.render("orders", { orders: allOrders });
        }
    });
});

//================
// Checkout
//================

// app.post("/orders", isLoggedIn, function (req, res) {
//     console.log('POST: orders');
//     var flag = false;
//     Cart.findOne({ userId: req.user._id }, function (err, foundCart) {
//         if (err) {
//             console.log(err);
//         } else {
//             var newItems = [];
//             var total = 0;  
//             foundCart.items.forEach((item) =>{       
//                 Product.findById(item.id, function(err, foundProduct){
//                     if(err){
//                         console.log(err);
//                     } else {
//                         var temp = foundProduct.quantity - item.quantity;
//                         console.log("temp is " + temp );
//                         if(temp >= 0){
//                             foundProduct.quantity -= item.quantity;
//                             foundProduct.save(); 
//                             newItems.push(item);
//                             total += (item.price * item.quantity);
//                         } else {
//                             console.log("not enough inventory");
//                             let flag = true;
//                         } 
//                     }    
//                     console.log(foundProduct);    
//                 });    
//             });
//             console.log("flag is " + flag);
//             if(!flag){
//                 var newOrder = { userId: req.user._id, items: newItems, total: total };
//                 Order.create(newOrder, function (err, newlyCreated) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log(newlyCreated);
//                     foundCart.items = [];
//                     foundCart.save(); 
//                     res.redirect("/items");    
//                     }
//                 });
//             }  
//         }
//      });                       
// });
app.post("/orders", isLoggedIn, function (req, res) {
    console.log('POST: orders');
    var newItems = [];
    var total = 0;
    Cart.findOne({ userId: req.user._id }, function (err, foundCart) {
        if (err) {
            console.log(err);
        } else {
            foundCart.items.forEach((item) =>{
                newItems.push(item);
                total += (item.price * item.quantity);
                Product.findById(item.id, function(err, foundProduct){
                foundProduct.quantity -= item.quantity;
                foundProduct.save();
                });
            });
            var newOrder = { userId: req.user._id, items: newItems, total: total };
            console.log("new items are " + newItems);
            Order.create(newOrder, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
                    foundCart.items = [];
                    foundCart.save();     
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
    console.log(req.params.id);
    console.log(req.body.quantity);

    Cart.findOne({ userId: req.user._id }, function (err, foundCart) {
        if (err) {
            //console.log(err);
        } else {
            Product.findById(req.params.id, function (err, foundProduct) {
                if (err) {
                    console.log(err);
                } else {
                    let isFound = false;
                    // console.log("request item id:" + req.params.id); 
                    foundCart.items.forEach((item) => {
                        // console.log("cart item id:" + item._id); 
                        if (item._id == req.params.id) {
                            isFound = true;
                            item.quantity = req.body.quantity;
                        }
                    });

                    if (!isFound) {
                        var item = { title: foundProduct.item, id: req.params.id, price: foundProduct.price, image: foundProduct.image, quantity: req.body.quantity };
                        foundCart.items.push(item);
                    }
                    // var item = { title: foundProduct.item, id: req.params.id, price: foundProduct.price, image: foundProduct.image, quantity: 1 };
                    // foundCart.items.push(item);
                    foundCart.save();
                    // console.log(foundCart);
                    res.redirect("/items");
                }
            });
        }
    });
});

app.delete("/cart/:id", isLoggedIn, function (req, res) {
    console.log(req.params.id);
    Cart.findOne({ userId: req.user._id }, function (err, foundCart) {
        if (err) {
            console.log(err);
        } else {
            foundCart.items.pull({ _id: req.params.id });
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
    var perPage = 9;
    var page = req.query.page || 1;
    var keyWord = req.body.itemName;

    const regex = '\.*' + keyWord + '\.';
    Product.find({ item: { $regex: keyWord, $options: 'i' } })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, allProducts) {
            if (err) {
                console.log(err);
            } else {
                console.log(allProducts.length);
                res.render("index", { products: allProducts, current: page, pages: Math.ceil(allProducts.length / perPage) });

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
    var quantity = req.body.quantity;

    var newProduct = {
        item: name, category: category, quantity: quantity,
        image: image, description: desc, price: price, quantity: quantity
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

// ============
// Middleware
// ============
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

///////////////////////////////added on 4/26








