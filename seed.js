var mongoose = require("mongoose");
var Product = require("./models/product");
var User = require("./models/user");
var Cart = require("./models/cart");
var Order = require("./models/order");

var productData = [

    {
        isDeleted: false,
        quantity: 1,
        item: 'Beats Headphone',
        category: 'Headphone',
        image: 'https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738',
        description: 'Immerse yourself in an emotional experience. The Solo2 has a more dynamic, wider range of sound, with a clarity that will bring you closer to what the artist intended. Whether you’re into hip-hop, heavy metal, jazz or electronic, you will feel the higher fidelity sound in your Solo2 . Take control. With the color-matched RemoteTalk cable, you can change songs, adjust the volume and even take calls, without having to reach for your device. (Compatible with iOS devices. Functionality may vary by device',
        price: 139.99

    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Sennheiser Headphone',
        category: 'Headphone',
        image: 'http://farm8.static.flickr.com/7108/27275208973_b94a6f2aff.jpg',
        description: 'With Pink Floyd references like printed triangles and rainbow coating background on the ear cups, and rainbow-colored stitching on the headband we gave this HD1 Wireless Special Edition a look all its own.',
        price: 499.95
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Dell Headphone',
        category: 'Headphone',
        image: 'https://images-na.ssl-images-amazon.com/images/I/71z5xSk89rL._SX425_.jpg',
        description: "Maximizing your personal audio experience has never been easier than with ZX-Series Monitor headphones. Built with comfort and performance in mind, there's no need to compromise.",
        price: 18.05
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Dell Mic Headphone',
        category: 'Headphone',
        image: 'http://farm1.static.flickr.com/905/26734945787_180141fab8.jpg',
        description: 'These headphones combine low profile design, soft ear pillows, and supreme sound with the ultra-convenient mic / remote, making it a go-to on any budget.',
        price: 34.99
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Bluetooth Headphone',
        category: 'Headphone',
        image: 'http://farm1.static.flickr.com/875/41133504202_1fbaee9529.jpg',
        description: 'Be ready to take the call, wherever you’re connected. The Voyager 5200 UC Bluetooth headset offers our most advanced, adaptive noise cancelling with WindSmart technology to reduce disruptive noise. It’s ready to work.',
        price: 179.99
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Sporty Headphone',
        category: 'Headphone',
        image: 'http://farm1.static.flickr.com/814/26734417607_778913c7a0.jpg',
        description: 'Bose A20 Aviation Headset with Bluetooth 10% off 2nd & subsequent Bose A20 Headset FREE Bose Bluetooth Speaker.',
        price: 1095.99
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'iphone8',
        category: 'Phone',
        image: 'http://farm1.static.flickr.com/886/41507422672_3ecc8d2d29.jpg',
        description: 'iPhone 8 introduces an all‑new glass design. The world’s most popular camera, now even better. The most powerful and smartest chip ever in a smartphone. Wireless charging that’s truly effortless.',
        price: 599.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'iphone7',
        category: 'Phone',
        quantity: 1,
        image: 'http://farm1.static.flickr.com/900/26740112187_ac6d4ec891.jpg',
        description: 'Great connectivity of this device includes Bluetooth 4.2 version with A2DP, WiFi 802.11 a/b/g/n/ac + MIMO and NFC to make payments and allows connection to other devices. Including the battery, the Apple iPhone 7 phone has 138 grams and its a very thin device, only 7.1 mm.',
        price: 499.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'iphone6',
        category: 'Phone',
        image: 'https://cdn2.gsmarena.com/vv/bigpic/apple-iphone-6-4.jpg',
        description: 'Keep your contacts and important documents close at hand with this Apple iPhone 6, which connects with iCloud to share documents and information with your computer. The slim design of this phone doesnt skimp on features while being heavy on style',
        price: 399.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'iphone8plus',
        category: 'Phone',
        image: 'http://farm5.static.flickr.com/4623/27862145609_e520a1f18d.jpg',
        description: 'Phone 8 Plus introduces an all-new glass design. The worlds most popular camera, now even better. The smartest, most powerful chip ever in a smartphone. Wireless charging thats truly effortless. And augmented reality experiences never before possible. iPhone 8 Plus. A new generation of iPhone.',
        price: 699.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'iphone7plus',
        category: 'Phone',
        image: 'http://farm1.static.flickr.com/830/40716346465_fd39ab06fe.jpg',
        description:'iPhone 7 Plus dramatically improves the most important aspects of the iPhone experience. It introduces advanced camera systems. The best performance and battery life ever in an iPhone. Immersive stereo speakers. The brightest, most colorful iPhone display. Splash and water resistance.',
        price: 569.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'iphone6plus',
        category: 'Phone',
        image: 'http://farm1.static.flickr.com/919/27739167768_2546cc7a23.jpg',
        description: 'Keep your contacts and important documents close at hand with this Apple iPhone 6, which connects with iCloud to share documents and information with your computer.',
        price: 399.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Canon EF 75-300mm III',
        category: 'Camera Lens',
        image: 'https://www.adorama.com/images/Large/ca75300afu_2.jpg',
        description: "This Certified Refurbished product is Manufacturer refurbished, shows limited or no wear, and includes all original accessories plus a 90-day warranty EF Mount Lens Aperture Range: f/4-45 DC Autofocus Motor Minimum Focus Distance: 4.9' 58mm Filter Thread Diameter",
        price: 70.97,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Canon EF 24-70mm II USM Lens',
        category: 'Camera Lens',
        image: 'https://static.bhphoto.com/images/images500x500/Canon_5175B002_EF_24_70mm_f_2_8L_II_1457983216000_843008.jpg',
        description: 'Spanning a popular and versatile range of focal lengths, the EF 24-70mm f/2.8L II USM is a Canon L-series zoom commonly thought of as the workhorse of lenses. Ranging from wide-angle to portrait length, this lens is also distinguished by its constant f/2.8 maximum aperture to benefit working in difficult lighting conditions and to afford greater control over depth of field. ',
        price: 1699.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Canon EF-S 18-55mm IS Zoom Lens',
        category: 'Camera Lens',
        image: 'https://shop.usa.canon.com/wcsstore/CanonB2BStoreFrontAssetStore/images/EFS18-55-4-56-IS-STM-Lens_2_xl.jpg',
        description: 'Spanning a popular and versatile range of focal lengths, the EF 24-70mm f/2.8L II USM is a Canon L-series zoom commonly thought of as the workhorse of lenses. Ranging from wide-angle to portrait length, this lens is also distinguished by its constant f/2.8 maximum aperture to benefit working in difficult lighting conditions and to afford greater control over depth of field. ',
        price: 218.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Canon EF 800mm IS USM Lens',
        category: 'Camera Lens',
        image: 'https://shop.usa.canon.com/wcsstore/ExtendedSitesCatalogAssetStore/ef800_56lisu_1_xl.jpg',
        description: "The EF 800mm f/5.6L IS USM Lens from Canon is currently Canon's longest telephoto lens, and an excellent choice for any long-distance application such as outdoor sports, wildlife, and photojournalism. Even though it has a long 800mm focal length, the magnesium alloy used in the construction for this lens makes it lighter then the 600mm f/4L lens, weighing in at less than 10 lb.",
        price: 218.99,
    },

    {
        isDeleted: false,
        quantity: 99,
        item: 'Lethato Oxford Goodyear Shoes',
        category: 'Shoes',
        image: 'https://i.pinimg.com/736x/05/58/c7/0558c796ee706b5cb289ffb68e3b509c--is-the-best-to-the.jpg',
        description: 'Handmade Wingtip Oxford Goodyear Welted Shoes, made of fine quality Calfskin leather. Goodyear welted construction process makes the shoes highly durable, water resistant and comfortable fitting as the leather molds to the foot over time.',
        price: 130.05,
    },


    {
        isDeleted: false,
        quantity: 99,
        item: 'GUCCI Cheryl GG Supreme Pump',
        category: 'Shoes',
        image: 'https://keep-ci-images.global.ssl.fastly.net/25ee7a9161885a7f0044de4f36680092.jpg',
        description: 'A fierce cat centers the horsebit hardware on a chic pump featuring a GG Supreme detail at the loafer-style vamp.',
        price: 995.05,
    },
    {
        isDeleted: false,
        quantity: 99,
        item: 'Nike Lunar Fingertrap TR',
        category: 'Shoes',
        image: 'http://farm5.static.flickr.com/4311/35352999243_ddc4db90f9.jpg',
        description: "There's no games with your training schedule when you have the comfort of the Nike Lunar Fingertrap TR! Textile upper with synthetic overlays offers a wrapped-like look. Lace-up closure for a secure, adjustable fit. Plush tongue and collar offers support. Mesh lining gives a breathable wear in shoe.Rubber outsole.",
        price: 75.99,
    },
    {
        isDeleted: false,
        quantity: 99,
        item: 'iphoneX',
        category: 'Phone',
        image: 'https://www.bell.ca/Styles/wireless/all_languages/all_regions/catalog_images/large/iPhoneX_spgry-en_lrg.png',
        description: 'iPhone x features an all-screen design with a 5.8-Inch super Retina HD display with HDR and true tone. Face ID lets you unlock and use Apple pay with just a glance. Powered by A11 Bionic, the most powerful and smartest chip ever in a smartphone. Supports augmented reality experiences in games and apps.',
        price: 1299.55,
    },
    {
        isDeleted: false,
        quantity: 99,
        item: 'Canon EF 75-300mm f/4-5.6 III',
        category: 'Camera Lens',
        image: 'https://www.grootgadgets.com/wp-content/uploads/2017/03/Canon-70-200mm-Lens-mug-White-replica-groot-gadgets-1-400x400.jpg',
        description: 'This Certified Refurbished product is Manufacturer refurbished, shows limited or no wear, and includes all original accessories plus a 90-day warranty EF Mount Lens Aperture Range: f/4-45 DC Autofocus Motor Minimum Focus Distance: 4.9 58mm Filter Thread Diameter',
        price: 70.97,
    },

]

// var cartData = [
//     {
//         userId: "5ade3079c3dbed2c01b73d16",
//         items: [
//             {
//                 price: 70,
//                 quantity: 1,
//                 image: "https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738",
//                 title: "Design Bundle Package",
//             },
//             {
//                 price: 80,
//                 quantity: 2,
//                 image: "https://www.bell.ca/Styles/wireless/all_languages/all_regions/catalog_images/large/iPhoneX_spgry-en_lrg.png",
//                 title: "Stuff on my Cat: The Book",
//             },
//             {
//                 price: 90.05,
//                 quantity: 3,
//                 image: "https://www.grootgadgets.com/wp-content/uploads/2017/03/Canon-70-200mm-Lens-mug-White-replica-groot-gadgets-1-400x400.jpg",
//                 title: "SpongeBob's First 100 Episodes",
//             }

//         ]
//     }
// ]

// var orderData = [
//     {
//         userId: "5ade3079c3dbed2c01b73d16",
//         total: 79.00,
//         items: [
//             {
//                 image: 'https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738',
//                 title: 'BEAT HEADPHONE',
//                 quantity: 1
//             }
//         ]
//     },
//     {
//         userId: "5ade3079c3dbed2c01b73d16",
//         total: 128.00,
//         items: [
//             {
//                 image: 'https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738',
//                 title: 'BEAT HEADPHONE',
//                 quantity: 1
//             },
//             {
//                 image: 'https://www.bell.ca/Styles/wireless/all_languages/all_regions/catalog_images/large/iPhoneX_spgry-en_lrg.png',
//                 title: 'IPHONEX',
//                 quantity: 1
//             }
//         ]
//     }
//]

function seedDB() {
    //Remove all campgrounds
    Product.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Initialize products!");
        //add a few campgrounds
        productData.forEach(function (seed) {
            Product.create(seed, function (err, product) {
                if (err) {
                    console.log(err)
                } 
            });
        });
        console.log("Finished Initialization of Products");
    });
    Order.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Initialize orders!");

        console.log("Finished Initialization of Orders");
    });



Cart.find({},function(err, foundCart){
    if(err){
        console.log(err);
    } else {
        foundCart.forEach(function(cart){
            cart.items = [];
            cart.save();
        })
    }
        console.log("Initialize carts!");

        console.log("Finished Initialization of carts");
})


    // User.remove({}, function(err){
    //         if(err){
    //             console.log(err);
    //         }
    //         console.log("removed users!");


    //     }); 

}



module.exports = seedDB;
