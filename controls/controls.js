const UIController = (function(){
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

    return {
        displayCart: function(cart){
            let element, newHtml, totalPrice;
            totalPrice = 0;  
            element = $(DOMstrings.cart); 
            const html = '<tr class="productitm">' + 
                            '<td class="id">%id%</td>' + 
                            '<td><img src="%image%" class="thumb"></td>' + 
                            '<td><input type="number" value="%quantity%" min="0" max="99" class="qtyinput"></td>' + 
                            '<td>%title%</td>' + 
                            '<td>$%price%</td>' + 
                            '<td><span class="remove glyphicon glyphicon-trash"></span></td></tr>'; 
            Object.keys(cart).forEach((key) => {
                const item = cart[key]; 
                const price = item.price * item.quantity; 
                newHtml = html.replace('%image%', item.image)
                                .replace('%id%', key)
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
                        '<button id="submitbtn">Checkout</button>' + 
                        '</td></tr>'; 
            newHtml = newHtml.replace("%tax%", tax.toFixed(2)).replace("%totalPrice%", totalPrice.toFixed(2)); 
            element.append(newHtml); 
        }
    }
})(); 

$('document').ready(function(){
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

    // UIController.displayProducts(products); 
    // UIController.displayOrders(orders); 
    // UIController.displayCart(cart); 

    let listeners = (function(){
        const DOMstrings = {
            cart: '.card-description .cart', 
            quantity: '.productitm .qtyinput', 
            remove: '.remove', 
            checkout: '.checkout', 
            search: '.navbar-form', 
        }; 

        addItemToCartHandler = () => {
            $(DOMstrings.cart).click(event => {
                event.preventDefault(); 
                console.log('Adding item to cart'); 
                const id = $(event.target).parent().prev().prev().html(); 
                const data = {quantity: 1}; 
                updateItemInCart(id, data); 
            }); 
        }; 

        updateItemQuantityHandler = () => {
            $(DOMstrings.quantity).change(event => {
                event.preventDefault(); 
                console.log('Updating item quantity'); 
                const id =  $(event.target).parent().parent().children("td:nth-child(1)").html(); 
                const quantity = $(event.target).val(); 
                if(quantity == 0){
                    deleteFromCart(id); 
                } else {
                    $.ajax({
                        type: "POST", 
                        quantity: quantity, 
                        url: '/cart/' + id, 
                        contentType: 'application/json', 
                        success: () => { console.log('success'); }, 
                        error: () => { console.log('error'); }
                    })
                }
            }); 
        };

        removeItemFromCartHandler = () => {
            $(DOMstrings.remove).click(event => {
                event.preventDefault(); 
                const id = $(event.target).parent().parent().children("td:nth-child(1)").html(); 
                deleteFromCart(id); 
            }); 
        };

        checkoutHandler = () => {
            $(DOMstrings.checkout).click(event => {
                event.preventDefault(); 
                console.log("Checking out"); 
                $.ajax({
                    type: "POST", 
                    url: '/orders', 
                    success: () => { console.log('success'); }, 
                    error: () => { console.log('error'); }
                }); 
            }); 
        }; 

        updateItemInCart = (id, data) => {
            $.ajax({
                type: 'POST', 
                url: '/cart/' + id,
                data: data, 
                success: () => { console.log('success'); }, 
                error: () => { console.log('error'); }
            })
        }

        deleteFromCart = (id) => {
            console.log('Removing item from shopping cart')
            $.ajax({
                type: "DELETE", 
                url: '/cart/' + id, 
                success: () => { console.log('success'); }, 
                error: () => { console.log('error'); }
            });
        };

        return {
            init: () => {
                addItemToCartHandler(); 
                updateItemQuantityHandler(); 
                removeItemFromCartHandler();
                checkoutHandler();
            }
        }
    })();

    listeners.init(); 
})