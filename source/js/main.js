// Imports
//=require jquery/dist/jquery.min.js
//=require jquery-validation/dist/jquery.validate.min.js
//=require jquery-mask-plugin/dist/jquery.mask.min.js

// DOM
var MyApp = {

    onlyNumbers : function() {
        $('.only-numbers').on('keypress', function(event) {
            var numbers = /[0-9]/g;
            var key = String.fromCharCode(event.which);
            var other_keys = [9];
            if ($.inArray(event.keyCode, other_keys) >= 0 || numbers.test(key)) {
                return true;
            }
            return false;
        });
    },
    onlyLetters : function () {
        $('.only-letters').on('keypress', function(event) {
            var englishAlphabetAndWhiteSpace = /[A-Za-z- ]/g;
            var other_keys = [8, 9, 37, 39, 193, 225, 200, 232, 205, 237, 211, 243, 218, 250, 209, 241];
            var key = String.fromCharCode(event.which);
            if ($.inArray(event.keyCode, other_keys) >= 0 || englishAlphabetAndWhiteSpace.test(key)) {
                return true;
            }
            return false;
        });
    },
    quote : {
        form : function () {
            jQuery.validator.addMethod("validEmail", function(value) {
                if(value == '') 
                    return true;
                var temp1;
                temp1 = true;
                var ind = value.indexOf('@');
                var str2=value.substr(ind+1);
                var str3=str2.substr(0,str2.indexOf('.'));
                if(str3.lastIndexOf('-')==(str3.length-1)||(str3.indexOf('-')!=str3.lastIndexOf('-')))
                    return false;
                var str1=value.substr(0,ind);
                if((str1.lastIndexOf('_')==(str1.length-1))||(str1.lastIndexOf('.')==(str1.length-1))||(str1.lastIndexOf('-')==(str1.length-1)))
                    return false;
                str = /(^[a-zA-Z0-9]+[\._-]{0,1})+([a-zA-Z0-9]+[_]{0,1})*@([a-zA-Z0-9]+[-]{0,1})+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,3})$/;
                temp1 = str.test(value);
                return temp1;
            }, "Please enter a valid email address.");

            $('.form').each(function () {
                $(this).validate({
                    errorClass: 'form__error',
                    rules: {
                        fname: { minlength: 2 },
                        lname: { minlength: 2 },
                        email: { minlength: 3, maxlength: 255, validEmail: true },
                        phone: { minlength: 12, maxlength: 12 },
                        zipcode: {
                            digits: true,
                            minlength: 3,
                            maxlength: 5,
                            remote: {
                                url: 'http://www.freewaylms.com/controller/validation-zipcode.php?',
                                dataFilter: function (data) {
                                    if (data === "1") {
                                        return '"true"';
                                    }
                                    return '"Please enter a valid zip code"';
                                }
                            }
                        }
                    },
                    messages: {
                        fname: {
                            required: 'Please enter your first name'
                        },
                        lname: {
                            required: 'Please enter your last name'
                        },
                        email: {
                            required: 'Please enter your email'
                        },
                        phone: {
                            minlength: 'You must enter 10 digits',
                            maxlength: 'You must enter 10 digits',
                            required: 'Please enter your phone number'
                        },
                        zipcode: {
                            required: 'Please enter your zip code'
                        }
                    },
                    submitHandler: function (form) {
                        $('.form').addClass('form__loading');
                        form.submit();
                    }
                });
            });
        },
        phone : function () {
            $('#phone').mask('000-000-0000');
        }
    }
}

// On ready

$(function () {

    if ($('.only-numbers').length) {
        MyApp.onlyNumbers();
    }

    if ($('.only-letters').length) {
        MyApp.onlyLetters();
    }

    if ($('.form').length) {
        MyApp.quote.form();
        MyApp.quote.phone();
    }

});