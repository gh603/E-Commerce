$('document').ready(function(){
    $('.tab a').on('click', (event) => {
        e.preventDefault(); 
        target = $(event.currentTarget); 
        target.parent().addClass('active'); 
        target.parent().siblings().removeClass('active'); 

        href = target.attr('href'); 
        $('.tab-content > div').not(href).hide(); 
        $(href).fadeIn(600); 
    })
})