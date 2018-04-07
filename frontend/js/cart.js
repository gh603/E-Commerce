$('document').ready(function(){
    function calculateTotalPrice(table, columnIndex){
        var tot = 0; 
        table.find('.productitm').children("td:nth-child(" + columnIndex + ")").each((index, element) => {
            tot += parseFloat($(element).text().slice(1));
        }); 
        return tot; 
    }
    
    function calculateTax(subTotal, taxRate){
        return (subTotal * taxRate); 
    }

    function updateTaxAndTotal(table, subTotal, tax){
        total = subTotal + tax; 

        table.find('.extracosts').children("td:nth-child(3)").each((index, element) => {
            $(element).text('$' + tax.toFixed(2)); 
        })

        $('.thick').text('$' + total.toFixed(2)); 
    }

    $table = $('#cart'); 
    $priceIndex = 4; 
    $taxRate = 0.06; 
    $subTotal = 0; 
    $tax = 0; 

    $subTotal = calculateTotalPrice($table, $priceIndex); 
    $tax = calculateTax($subTotal, $taxRate); 

    updateTaxAndTotal($table, $subTotal, $tax); 

    $('.remove').click((event) => {
        price = 0; 

        target = $(event.currentTarget).parent().parent(); 
        console.log(target); 
        $(target).children("td:nth-child(" + $priceIndex + ")").each((index, element) => {
            price += parseFloat($(element).text().slice(1));
        })

        $(target).remove(); 

        $subTotal -= price; 
        $tax = calculateTax($subTotal, $taxRate); 

        updateTaxAndTotal($table, $subTotal, $tax);
    }); 
})