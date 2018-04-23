$('document').ready(function(){
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
                const id =  $(event.target).parent().parent().children("td:nth-child(1)").html(); 
                const quantity = parseInt($(event.target).val()); 
                if(quantity == 0){
                    deleteFromCart(id); 
                } else {
                    console.log("Update Item"); 
                    const data = {quantity: quantity}; 
                    updateItemInCart(id, data); 
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