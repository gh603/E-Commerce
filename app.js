
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
    Order = require("./models/order"),
    async = require("async")


mongoose.connect("mongodb://localhost/e-commerce");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname));
seedDB();


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
            var newCart = { userId: newUser._id, items: [] }
            Cart.create(newCart, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(newlyCreated);
                }
            });
            
            req.flash("success", "Welcome! " + newUser.fname );
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
            .find({isDeleted: false})
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
            .find({isDeleted: false})
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



app.post("/orders", isLoggedIn, async function (req, res) {
    console.log('POST: orders');
    var newItems = []
    
    var total = 0;
    var flag = false;
    const foundCart = await new Promise((resolve, reject)=>{
        Cart.findOne({ userId: req.user._id}, (err, foundCart1) => {
        if(err) {
            console.log(err); 
            reject(err)
        } else {
            
            resolve(foundCart1)
        }

        });
    })
    for(let i = 0; i < foundCart.items.length; i++){
        var item = foundCart.items[i]
        var tmp = await new Promise((resolve, reject)=>{
                total += item.price * item.quantity; 
                Product.findById(item.id, (err, foundProduct) => {    
                    resolve(foundProduct)
                })
        })
        newItems.push(tmp); 
        total += item.price * item.quantity; 
    }
    for(let j = 0; j < newItems.length; j++){
        if(foundCart.items[j].quantity>newItems[j].quantity){
            flag = true;
        }
    }
    if(!flag){
        const newOrder = { userId: req.user._id, items: newItems, total:total}; 
        Order.create(newOrder, (err, newlyCreated) => {
            if(err) { console.log(err); }
            else {
                foundCart.items = []; 
                foundCart.save(); 
            }
        });
        for(let k = 0; k < newItems.length; k++){
            Product.findById(newItems[k].id, function(err, foundProduct){
                foundProduct.quantity -=  newItems[k].quantity;
                foundProduct.save();
            })
        }
        req.flash("success", "Order successfully!"); 
        res.send("/orders");
    } else {
            req.flash("error", "Not enough inventory!"); 
            res.send("/cart");
    }
    
})   
 

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
    Product.find({ item: { $regex: keyWord, $options: 'i' }, isDeleted: false })
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
        image: image, description: desc, price: price, quantity: quantity, isDeleted: false
    }
    // Create a new campground and save to DB
    Product.create(newProduct, function (err, newlyCreated) {
        if (err) {
            req.flash("error", "Wrong created!");
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash("success", "New item successfully created!");
            res.redirect("/items");
        }
    });
});

//================
// Update
//================

app.put("/:id", isAdmin, function (req, res) {
    // find and update the correct campground
    console.log("req.body="+req.body);
    Product.findByIdAndUpdate(req.params.id, req.body.product, function (err, updatedProduct) {
        console.log("req.body.product"+req.body.product);
        if (err) {
            req.flash("error", "Fail to update");
            res.redirect("/items");
        } else {
            //redirect somewhere(show page)
            req.flash("success", "Updated successfully");
            res.redirect("/items");
        }
    });
});
//================
// Delete
//================
app.delete("/delete", isAdmin, function (req, res) {
    //findByIdAndRemove
    console.log(req.body.id);
    Product.findById(req.body.id, function (err, foundProduct) {
        if (err) {
            res.redirect("back");
        } else {
            foundProduct.isDeleted = true;
            foundProduct.save();
            res.redirect("/items");
        }
    });
});




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








