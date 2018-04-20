$('document').ready(function(){
    let UIController = (function(){
        const DOMstrings = {
            products: ".productList",  
            product: ".card", 
            productContent: "card-content", 
            productTitle: ".card-description .title", 
            productCart: ".card-description .cart", 
            productPrice: ".top_bar span", 
            productImage: ".card .img img", 
            productCategory: ".card-footer span", 
            orders: ".Orders", 
            cart: "#cart tbody", 
        }; 

        displayProduct = (item) => {
            let element, newHtml; 
            element = $(DOMstrings.products); 
            const html = '<div class="card">' + 
                    '<div class="card-content">' + 
                        '<div class="top-bar"><span>$%price%</span></div>' + 
                        '<div class="img"><img src=%img%></div></div>' + 
                    '<div class="card-description">' + 
                        '<div class="title">%title%</div>' + 
                        '<div class="cart"><span class="glyphicon glyphicon-shopping-cart"></span></div></div>' + 
                    '<div class="card-footer">' + 
                        '<div class="span">%category1%</div>' + 
                        '<div class="span">%category2%</div>' + 
                        '<div class="span">%category3%</div></div></div>'; 
            newHtml = html.replace('%price%', item.price); 
            newHtml = newHtml.replace('%img%', item.img); 
            newHtml = newHtml.replace('%title%', item.title); 
            newHtml = newHtml.replace('%category1%', item.category[0]); 
            newHtml = newHtml.replace('%category2%', item.category[1]); 
            newHtml = newHtml.replace('%category3%', item.category[2]); 
            element.append(newHtml); 
        }; 

        displayOrder = (order) => {
            let element, newHtml; 
            element = $(DOMstrings.orders); 
            newHtml ='<div class="OrderCard">' + 
                            '<table class="order-desc">' +
                                '<tr><th style="width:15%">Order Placed</th>'+
                                '<th style="width:15%">Total</th>' + 
                                '<th style="width:70%">Order #</th></tr>' + 
                                '<tr><td style="width:15%">April 3rd, 2018</td>' + 
                                    '<td style="width:15%">$%total%</td>' + 
                                    '<td style="width:70%">%orderId%</td></tr></table>' + 
                            '<div class="order-content"><div class="orderItems">'; 
            newHtml = newHtml.replace('%total%', order.total); 
            newHtml = newHtml.replace('%orderId%', order.orderId);
            Object.keys(order.items).map((key) => {
                let val = order.items[key]; 
                newHtml += '<div class="Item"><div class="img"><img src=%img% /></div><div class="title">%title%</div></div>'; 
                newHtml = newHtml.replace('%img%', val.image); 
                newHtml = newHtml.replace('%title%', val.title); 
            }); 
            newHtml += '</div><ul class="orderFeedback">' + 
                            '<li><a>Leave Seller feedback</a></li>' + 
                            '<li><a>Write a product review</a></li></ul></div></div>'; 
            element.append(newHtml); 
        }

        return {
            displayProducts: function(items){
                Object.keys(items).forEach((key) => {
                    displayProduct(items[key]); 
                })
            }, 
            displayOrders: function(orders){
                Object.keys(orders).forEach((key) => {
                    displayOrder(orders[key]); 
                })
            }, 
            displayCart: function(cart){
                let element, newHtml, totalPrice;
                totalPrice = 0;  
                element = $(DOMstrings.cart); 
                const html = '<tr class="productitm">' + 
                                '<td><img src="%image%" class="thumb"></td>' + 
                                '<td><input type="number" value="%quantity%" min="0" max="99" class="qtyinput"></td>' + 
                                '<td>%title%</td>' + 
                                '<td>$%price%</td>' + 
                                '<td><span class="remove glyphicon glyphicon-trash"></span></td></tr>'; 
                Object.keys(cart).forEach((key) => {
                    const item = cart[key]; 
                    const price = item.price * item.quantity; 
                    newHtml = html.replace('%image%', item.image)
                                        .replace('%quantity%', item.quantity)
                                        .replace('%title%', item.title)
                                        .replace('%price%', price); 
                    element.append(newHtml); 
                    totalPrice += price; 
                }); 

                const tax = (totalPrice * 0.06); 
                totalPrice += tax; 
                newHtml = '<tr class="extracosts">' + 
                            '<td class="light">Shipping &amp; Tax</td><td colspan="2" class="light"></td>' + 
                            '<td>$%tax%</td><td>&nbsp;</td></tr>' + 
                          '<tr class="totalprice">' + 
                            '<td class="light">Total</td><td colspan="2">&nbsp;</td>' + 
                            '<td><span class="thick">$%totalPrice%</span></td>' + 
                            '<td>&nbsp;</td></tr>' + 
                          '<tr class="checkoutrow">' + 
                            '<td colspan="5" class="checkout">' + 
                            '<button id="submitbtn">Checkout Now!</button>' + 
                            '</td></tr>'; 
                console.log(newHtml); 
                newHtml = newHtml.replace("%tax%", tax.toFixed(2)).replace("%totalPrice%", totalPrice.toFixed(2)); 
                element.append(newHtml); 
            }
        }
    })(); 
    
    let products = {
        product1: {
            price: 12.95, 
            title: 'Beats Headphone',
            img: 'https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738', 
            category: ['RED', 'BEATS', 'HEADPHONE'],  
        }, 
        product2: {
            price: 1200.95, 
            title: 'IPhone X',
            img: 'https://www.bell.ca/Styles/wireless/all_languages/all_regions/catalog_images/large/iPhoneX_spgry-en_lrg.png', 
            category: ['IPHONE', 'PHONE', 'MOBILE'],  
        }, 
        product3: {
            price: 44.55, 
            title: 'Beats Headphone',
            img: 'https://www.grootgadgets.com/wp-content/uploads/2017/03/Canon-70-200mm-Lens-mug-White-replica-groot-gadgets-1-400x400.jpg', 
            category: ['CAMERA', 'GADGET', 'LENS'],  
        }, 
        product4: {
            price: 5.95, 
            title: 'Beats Headphone',
            img: 'https://i.pinimg.com/736x/05/58/c7/0558c796ee706b5cb289ffb68e3b509c--is-the-best-to-the.jpg', 
            category: ['SHOES', 'FORMAL', 'LEATHER'],  
        }, 
    }

    let orders = {
        order1: {
            total: 79.00, 
            orderId: 1, 
            items: {
                item1: {
                    image: 'https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738', 
                    title: 'BEAT HEADPHONE', 
                }
            }
        }, 
        order2: {
            total: 128.00, 
            orderId: 2, 
            items: {
                item1: {
                    image: 'https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738', 
                    title: 'BEAT HEADPHONE', 
                }, 
                item2: {
                    image: 'https://www.bell.ca/Styles/wireless/all_languages/all_regions/catalog_images/large/iPhoneX_spgry-en_lrg.png', 
                    title: 'IPHONEX', 
                }
            }
        }, 
    }

    let cart = {
        item1: {
            price: 70, 
            quantity: 1, 
            image: "https://tctechcrunch2011.files.wordpress.com/2014/11/solo2-wireless-red-quarter.jpg?w=738", 
            title: "Design Bundle Package", 
        }, 
        item2: {
            price: 80, 
            quantity: 2, 
            image: "https://www.bell.ca/Styles/wireless/all_languages/all_regions/catalog_images/large/iPhoneX_spgry-en_lrg.png", 
            title: "Stuff on my Cat: The Book", 
        }, 
        item3: {
            price: 90.05, 
            quantity: 3, 
            image: "https://www.grootgadgets.com/wp-content/uploads/2017/03/Canon-70-200mm-Lens-mug-White-replica-groot-gadgets-1-400x400.jpg", 
            title: "SpongeBob's First 100 Episodes", 
        }
    }

    UIController.displayProducts(products); 
    UIController.displayOrders(orders); 
    UIController.displayCart(cart); 
})