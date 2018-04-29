const listeners = (function () {
    const DOMstrings = {
        cart: '.card-description .cart',
        quantity: '.productitm .qtyinput',
        remove: '.remove',
        checkout: '.checkout #submitbtn',
        search: '.navbar-form',
        products: '.productList', 
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
        // $.post("/filter", data, data=>{
        //     console.log(data); 
        // })
        $.ajax({
            type: "GET", 
            url: '/items', 
            data: data, 
            success: (data) => { 
                $(DOMstrings.products).empty(); 
                $(DOMstrings.products).html(data); 
             }, 
            error: () => { console.log('error')}
        })
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
            const id = $.trim($(event.target).parent().prev().prev().html());
            const data = { quantity: 1 };
            updateItemInCart(id, data);
        },
        addItemToCartFromDescHandler: (event) => {
            event.preventDefault(); 
            console.log('Adding item to cart'); 
            const modalBody = $(event.currentTarget).parent().prev(); 
            const id = $.trim(modalBody.find('div .id').html()); 
            const data = {quantity: parseInt(modalBody.find('div div .qtyinput').val())}; 
            console.log(data); 
            updateItemInCart(id, data); 
        }, 
        checkoutHandler: (event) => {
            event.preventDefault();
            console.log("Checking out");
            $.ajax({
                type: "POST",
                url: '/orders',
                success: (data) => { 
                    console.log(data);
                    window.location.href = data
                },
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
        cartSubmit: '.checkout #submitbtn',
        modal: {
            modalTitle: '.modal-title', 
            modalId: '.modal-body .id', 
            modalImg: '.modal-body .img img', 
            modalDes: '.modal-body .modal-description', 
            modalPrice: '.modal-body .modal-price', 
            // modalInventory: '.modal-body .modal-quantity', 
            modalBtnToSubmit: '.modal-footer .btn'
        }
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

            imgclone.animate({
                'width': 0,
                    'height': 0
            }, function () {
                $(this).detach()
            });
        }
    }; 

    extractInfoFromCard = (cardEvent) => {
        let data = []; 
        target = $(cardEvent.currentTarget); 
        data['img'] = $(target).find('img').eq(0).attr('src'); 
        data['price'] = $(target).prev().find('span').eq(0).text(); 
        card_desc = $(target).parent().next(); 
        data['id'] = $(card_desc).find('.id').text(); 
        data['title'] = $(card_desc).find('.title').text();
        data['description'] = $(card_desc).find('.item-desc').text(); 
        return data;
    };

    showItemDescription = (event) => {
        const data = extractInfoFromCard(event);
        $(DOMstrings.modal.modalTitle).text(data.title);
        $(DOMstrings.modal.modalPrice).find('p').eq(0).text(data.price); 
        $(DOMstrings.modal.modalId).text(data.id);  
        $(DOMstrings.modal.modalDes).find('p').eq(0).text(data.description);
        // $(DOMstrings.modal.modalInventory).find('p').eq(0).text(data.quantity); 
        $(DOMstrings.modal.modalImg).attr('src', data.img); 
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
        viewItemDescHandler: (event) => {
            showItemDescription(event); 
        },
        changeItemState: (event) => {
            const quantity = $(event.currentTarget).val(); 
            if(quantity > 0){
                $(DOMstrings.modal.modalBtnToSubmit).attr('disabled', false); 
            } else {
                $(DOMstrings.modal.modalBtnToSubmit).attr('disabled', true); 
            }
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
        totalPrice: '.totalprice .thick', 
        sideList: '.sideList li', 
        cartDesLink: '.card', 
        modalAddToCart: '.modal-footer .btn',
        modalQuantity: '.modal-body .qtyinput',
        products: '.productList'
    }; 

    const config = {
        priceIndex: 6, 
        taxRate: 0.06, 
    }; 

    addItemToCartHandler = () => {
        $(DOMstrings.cart).on('click', event => {
            reqCtrl.addItemToCartHandler(event); 
            UICtrl.addItemToCartHandler(event); 
        }); 
        $(DOMstrings.modalAddToCart).on('click', event => {
            reqCtrl.addItemToCartFromDescHandler(event); 
        })
    }; 

    checkItemState = () => {
        $(DOMstrings.modalQuantity).on('change', event => {
            UICtrl.changeItemState(event); 
        }); 
    }; 

    updateItemQuantityHandler = () => {
        $(DOMstrings.quantity).on('change', event => {
            UICtrl.updateItemQuantityHandler(event, $(DOMstrings.cartTable), config.priceIndex, config.taxRate); 
            reqCtrl.updateItemQuantityHandler(event); 
        }); 
    }; 

    removeItemFromCartHandler = () => {
        $(DOMstrings.remove).on('click', event => {
            reqCtrl.removeItemFromCartHandler(event); 
            UICtrl.removeItemFromCartHandler(event, $(DOMstrings.cartTable), config.priceIndex, config.taxRate); 
        })
    }; 

    checkoutHandler = () => {
        $(DOMstrings.checkout).on('click', event => {
            reqCtrl.checkoutHandler(event); 
        })
    };

    filterInProductsHandler = () => {
        $(DOMstrings.sideList).on('click', event => {
            reqCtrl.filterHandler(event); 
        })
    }; 
    
    viewItemDescHandler = () => {
        $(DOMstrings.products).delegate('.card .img', 'click', event => {
            UICtrl.viewItemDescHandler(event); 
        }); 
    }; 

    setupEventListener = () => {
        checkItemState();
        viewItemDescHandler();
        addItemToCartHandler(); 
        updateItemQuantityHandler(); 
        removeItemFromCartHandler(); 
        checkoutHandler(); 
        filterInProductsHandler(); 
        // changeCartState();
    }

    return {
        init: () => {
            setupEventListener();
        }
    }
})(listeners, UIController); 

$('document').ready(function () {
    controller.init(); 
})