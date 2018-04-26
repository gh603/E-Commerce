// $('document').ready(function(){




//     $table = $('#cart'); 
//     $priceIndex = 5; 
//     $taxRate = 0.06; 
//     $subTotal = 0; 
//     $tax = 0; 

//     $subTotal = calculateTotalPrice($table, $priceIndex); 
//     $tax = calculateTax($subTotal, $taxRate); 

//     updateTaxAndTotal($table, $subTotal, $tax); 

//     $('.remove').click((event) => {
//         price = 0; 

//         target = $(event.currentTarget).parent().parent(); 
//         $(target).children("td:nth-child(" + $priceIndex + ")").each((index, element) => {
//             price += parseFloat($(element).text().slice(1));
//         })

//         $(target).remove(); 

//         $subTotal -= price; 
//         $tax = calculateTax($subTotal, $taxRate); 

//         updateTaxAndTotal($table, $subTotal, $tax);
//     }); 
// })