const listeners = (function () {
    const DOMstrings = {
        cart: '.card-description .cart',
        quantity: '.productitm .qtyinput',
        remove: '.remove',
        checkout: '.checkout #submitbtn',
        search: '.navbar-form',
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

    filterInProducts = (data) => {
        $.ajax({
            type: "GET", 
            url: '/items', 
            data: data, 
            success: () => { console.log('success'); }, 
            error: () => { console.log('error')}
        })
    }

    return {
        removeItemFromCartHandler: (event) => {
            event.preventDefault();
            const id = $(event.target).parent().parent().children("td:nth-child(1)").html();
            deleteFromCart(id);
        },
        updateItemQuantityHandler: (event) => {
            event.preventDefault();
            const id = $(event.target).parent().parent().children("td:nth-child(1)").html();
            const quantity = parseInt($(event.target).val());
            if (quantity == 0) {
                deleteFromCart(id);
            } else {
                console.log("Update Item");
                const data = { quantity: quantity };
                updateItemInCart(id, data);
            }
        },
        addItemToCartHandler:(event)=>{
            event.preventDefault();
            console.log('Adding item to cart');
            const id = $(event.target).parent().prev().prev().html();
            const data = { quantity: 1 };
            updateItemInCart(id, data);
        },
        checkoutHandler: (event) => {
            event.preventDefault();
            console.log("Checking out");
            $.ajax({
                type: "POST",
                url: '/orders',
                success: () => { console.log('success'); },
                error: () => { console.log('error'); }
            });
        },
        filterHandler: (event) => {
            event.preventDefault(); 
            const cate = $(event.currentTarget).text();
            const data = {cate: cate}; 
            console.log(data); 
            filterInProducts(data); 
        }
    }
})();

const UIController = (function () {
    const DOMstrings = {
        cartNav: '.nav .cart', 
        cartBtn: '.card .cart', 
    }; 

    calculateTotalPrice = (table, priceIndex) => {
        var tot = 0;
        table.find('.productitm').children("td:nth-child(" + priceIndex + ")").each((index, element) => {
            tot += parseFloat($(element).text().slice(1));
        });
        return tot;
    }; 

    calculateTax = (subTotal, taxRate) => {
        return (subTotal * taxRate);
    }; 

    updateTaxAndTotal = (table, priceIndex, taxRate) => {
        const subTotal = calculateTotalPrice(table, priceIndex);
        const tax = calculateTax(subTotal, taxRate);
        const total = subTotal + tax;

        table.find('.extracosts').children("td:nth-child(3)").each((index, element) => {
            $(element).text('$' + tax.toFixed(2));
        })

        $('.thick').text('$' + total.toFixed(2));
    }; 

    updateLineTotal = (event, table, priceIndex, taxRate) => {
        target = event.currentTarget; 
        const counts = $(target).val(); 
        const price = parseFloat($(target).parent().next().next().text()); 
        const total = price * counts; 
        $($(target).parent().next().next().next()).text('$' + total.toFixed(2)); 
        updateTaxAndTotal(table, priceIndex, taxRate); 
    }; 

    addToCart = (event) => {
        var cart = $(DOMstrings.cartNav);
        var imgtodrag = $(event.currentTarget).parent().prev().find(".img").find('img').eq(0);
        if (imgtodrag) {
            var imgclone = imgtodrag.clone()
                .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
                .css({
                'opacity': '0.5',
                    'position': 'absolute',
                    'height': '150px',
                    'width': '150px',
                    'z-index': '100'
            })
                .appendTo($('body'))
                .animate({
                'top': cart.offset().top + 10,
                    'left': cart.offset().left + 10,
                    'width': 75,
                    'height': 75
            }, 1000, 'easeInOutExpo');
            
            setTimeout(function () {
                cart.effect("shake", {
                    times: 2
                }, 200);
            }, 1500);

            imgclone.animate({
                'width': 0,
                    'height': 0
            }, function () {
                $(this).detach()
            });
        }
    }; 

    return {
        removeItemFromCartHandler: (event, table, priceIndex, taxRate) => {
            target = $(event.currentTarget).parent().parent();
            $(target).remove();
            updateTaxAndTotal(table, priceIndex, taxRate);
        }, 
        updateItemQuantityHandler: (event, table, priceIndex, taxRate) => {
            updateLineTotal(event, table, priceIndex, taxRate); 
        },
        loadCartHandler: (table, priceIndex, taxRate) => {
            updateTaxAndTotal; 
        },
        addItemToCartHandler: (event) => {
            addToCart(event); 
        }, 
    };
})();

const controller = (function(reqCtrl, UICtrl) {
    const DOMstrings = {
        cart: '.card-description .cart',
        quantity: '.productitm .qtyinput',
        cartItem: '.productitm', 
        remove: '.remove',
        checkout: '.checkout #submitbtn',
        search: '.navbar-form',
        cartTable: '#cart', 
        totalPrice: '.totalprice', 
        sideList: '.sideList li', 
    }; 

    const config = {
        priceIndex: 6, 
        taxRate: 0.06, 
    }; 

    addItemToCartHandler = () => {
        $(DOMstrings.cart).click(event => {
            reqCtrl.addItemToCartHandler(event); 
            UICtrl.addItemToCartHandler(event); 
        }); 
    }; 

    updateItemQuantityHandler = () => {
        $(DOMstrings.quantity).change(event => {
            UICtrl.updateItemQuantityHandler(event, $(DOMstrings.cartTable), config.priceIndex, config.taxRate); 
            reqCtrl.updateItemQuantityHandler(event); 
        }); 
    }; 

    removeItemFromCartHandler = () => {
        $(DOMstrings.remove).click(event => {
            reqCtrl.removeItemFromCartHandler(event); 
            UICtrl.removeItemFromCartHandler(event, $(DOMstrings.cartTable), config.priceIndex, config.taxRate); 
        })
    }; 

    checkoutHandler = () => {
        $(DOMstrings.checkout).click(event => {
            reqCtrl.checkoutHandler(event); 
        })
    };

    filterInProductsHandler = () => {
        console.log(DOMstrings.sideList); 
        $(DOMstrings.sideList).click(event => {
            reqCtrl.filterHandler(event); 
        })
    }

    return {
        init: () => {
            addItemToCartHandler(); 
            updateItemQuantityHandler(); 
            removeItemFromCartHandler(); 
            checkoutHandler(); 
            filterInProductsHandler(); 
        }
    }
})(listeners, UIController); 


$('document').ready(function () {
    controller.init(); 
})