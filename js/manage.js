$('document').ready(function(){
   

   $('.tab a').on('click', (event) => {
	   
	   
        event.preventDefault(); 
        target = $(event.currentTarget); 
        target.parent().addClass('active'); 
        target.parent().siblings().removeClass('active'); 

        href = target.attr('href'); 
        $('.tab-content > div').not(href).hide(); 
        $(href).fadeIn(600); 
    });
	
	
	
    	    var edit = document.getElementsByClassName('edit'), i;
			var button_update2 = document.getElementsByClassName('button_update2'), i;
			
			
			
			for (var i = 0; i < edit.length; i++) {
			edit[i].disabled = true;
			edit[i].style="border:none"
			
		    }	
			for (var i = 0; i < button_update2.length; i++) {
			button_update2[i].style="display:none";
			
		    }	
			
			
			
			
			
	
	$('.button_update').click(function(event){
		  
		  $( event.target ).parent().find( ".edit" ).prop('disabled', false);
          $( event.target ).parent().find( ".edit" ).css("display", "block");
		  $( event.target ).parent().find( ".edit" ).css("border", "solid");
		  $( event.target ).parent().find( ".edit" ).css("margin", "5px 0 5px 0");
		  
		  $( event.target ).parent().find( ".button_update2" ).css('display','block');
		  $( event.target ).parent().find( ".button_update2" ).css('float', 'right');
		 
		  
	});
	

	
	

	
});




