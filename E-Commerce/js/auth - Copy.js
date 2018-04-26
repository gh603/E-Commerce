$('document').ready(function(){
    $('.tab a').on('click', (event) => {
        event.preventDefault(); 
        target = $(event.currentTarget); 
        target.parent().addClass('active'); 
        target.parent().siblings().removeClass('active'); 

        href = target.attr('href'); 
        $('.tab-content > div').not(href).hide(); 
        $(href).fadeIn(600); 
    })
	
	
	var  error1= document.getElementById("error1");
	var  error2= document.getElementById("error2");
	var  error3= document.getElementById("error3");
	var  error4= document.getElementById("error4");
	var  error5= document.getElementById("error5");
	error1.style.visibility = 'hidden';
	error2.style.visibility = 'hidden';
	error3.style.visibility = 'hidden';
	error4.style.visibility = 'hidden';
	error5.style.visibility = 'hidden';
	
	//login check
    $("#button_login").click(function() {
        
		var a = 1;
		var b = 1;
		
		//check email
		var error1= document.getElementById("error1");
		var emailValue= document.getElementById("email").value; 
		var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
		if(!testEmail.test(emailValue)) {
			error1.style.visibility = 'visible';
			a = 1 ;
		}else{
			error1.style.visibility = 'hidden';
			a = 0;
		}
		
		//check password	
		var error2 = document.getElementById("error2");
		var passwordLength = document.getElementById("password").value; 
		if(passwordLength.length < 6 ) {
			error2.style.visibility = 'visible';
			b = 1;
		}else {
			error2.style.visibility = 'hidden';
			b = 0;
		}
		
		if( a == 0 && b == 0) {
			$("#form1").submit();
		}

	});  
	
	
		//sign-up check
	    $("#button_signup").click(function() {
        
		var a = 1;
		var b = 1;
		var c = 1;
		
		//check first name and last name
		var fname= document.getElementById("firstname").value; 
		var lname= document.getElementById("lastname").value; 
		
		if( $.trim(fname)  == "" || fname == undefined || fname == null || $.trim(lname) == "" || lname == undefined || lname == null) {
			error3.style.visibility = 'visible';
			a = 1 ;
		}else {
			error3.style.visibility = 'hidden';
			a = 0;
		}
		
		//check email
		var error4= document.getElementById("error4");
		var emailValue= document.getElementById("signup_email").value; 
		var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
		if (!testEmail.test(emailValue)) {
			error4.style.visibility = 'visible';
			b = 1 ;
		}else {
			error4.style.visibility = 'hidden';
			b = 0;
		}
		
		//check password	
		var error5= document.getElementById("error5");
		var passwordLength= document.getElementById("signup_password").value; 
		if(passwordLength.length < 6 ) {
			error5.style.visibility = 'visible';
			c = 1;
		}else {
			error5.style.visibility = 'hidden';
			c = 0;
		}
		
		if( a == 0 && c == 0 && b == 0) {
			$("#form2").submit();
		}

	});  
	
	
})