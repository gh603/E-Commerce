$('document').ready(function () {
    $('.tab a').on('click', (event) => {
        event.preventDefault();
        target = $(event.currentTarget);
        target.parent().addClass('active');
        target.parent().siblings().removeClass('active');

        href = target.attr('href');
        $('.tab-content > div').not(href).hide();
        $(href).fadeIn(600);
    })

    var error1 = $('#error1')
    var error2 = $('#error2')
    var error3 = $('#error3')
    var error4 = $('#error4')
    var error5 = $('#error5')
    var error6 = $('#error6')
    error1.hide(); 
    error2.hide(); 
    error3.hide(); 
    error4.hide(); 
    error5.hide(); 
    error6.hide(); 


    //login check
    $("#button_login").click(function () {

        var a = 1;
        var b = 1;

        //check email
        var emailValue = document.getElementById("email").value;
        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        if (!testEmail.test(emailValue)) {
            error1.show();
            a = 1;
        } else {
            error1.hide();
            a = 0;
        }

        //check password	
        var passwordLength = document.getElementById("password").value;
        if (passwordLength.length < 6) {
            error2.show();
            b = 1;
        } else {
            error2.hide();
            b = 0;
        }

        if (a == 0 && b == 0) {
            $("#form1").submit();
        }

    });

    //sign-up check
    $("#button_signup").click(function () {

        var a = 1;
        var b = 1;
        var c = 1;

        //check first name and last name
        var fname = document.getElementById("firstname").value;
        var lname = document.getElementById("lastname").value;

        if ($.trim(fname) == "" || fname == undefined || fname == null || $.trim(lname) == "" || lname == undefined || lname == null) {
            error3.show();
            a = 1;
        } else {
            error3.hide();
            a = 0;
        }

        //check email
        var emailValue = document.getElementById("signup_email").value;
        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        if (!testEmail.test(emailValue)) {
            error4.show();
            b = 1;
        } else {
            error4.hide();
            b = 0;
        }

        //check password	
        var passwordLength = document.getElementById("signup_password").value;
        if (passwordLength.length < 6) {
            error5.show();
            c = 1;
        } else {
            error5.hide();
            c = 0;
        }

        if (a == 0 && c == 0 && b == 0) {
            $.ajax({
                type: 'GET', 
                url: '/signup', 
                data: {email: emailValue}, 
                success: (data) => {
                    if(data === 'success'){
                        error6.hide()
                        $("#form2").submit();
                    } else {
                        error6.show(); 
                    }
                }, 
                error: () => {
                    console.log('error'); 
                }
            }); 
            
        }

    });
})