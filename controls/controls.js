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
        }
    }
})();

const UIController = (function () {
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
    }

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
        }
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
    }; 

    const config = {
        priceIndex: 6, 
        taxRate: 0.06, 
    }; 

    // loadCartHandler = () => {
    //     // console.log($(DOMstrings.cartTable)); 
    //     // $('document').ready(() => { console.log('loaded')}); 
    //     $('.cartItem').ready((event) => {
    //         console.log('loaded'); 
    //         UICtrl.loadCartHandler($(DOMstrings.cartTable), config.priceIndex, config.taxRate); 
    //     })
    // }

    addItemToCartHandler = () => {
        $(DOMstrings.cart).click(event => {
            reqCtrl.addItemToCartHandler(event); 
        }); 
    }; 

    updateItemQuantityHandler = () => {
        $(DOMstrings.quantity).change(event => {
            UICtrl.updateItemQuantityHandler(event, $(DOMstrings.cartTable), config.priceIndex, config.taxRate); 
            // reqCtrl.updateItemQuantityHandler(event); 
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
    }

    return {
        init: () => {
            // loadCartHandler(); 
            addItemToCartHandler(); 
            updateItemQuantityHandler(); 
            removeItemFromCartHandler(); 
            checkoutHandler(); 
        }
    }
})(listeners, UIController); 


$('document').ready(function () {
    controller.init(); 
})