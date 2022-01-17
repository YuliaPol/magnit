jQuery(function ($) {
    $(document).ready(function () {
        // Restricts input for the set of matched elements to the given inputFilter function.
        $.fn.inputFilter = function(inputFilter) {
            return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    this.value = "";
                }
            });
        };
        
        //add icons and names of uploaded files 
        $('.form-wrap').on('change', '.input-file', function(e){
            let files = this.files;
            let question = $(this).parents('.form-group');
            let filesWrap = question.find('.files-container');
            let fileList = '';
            for (let i = 0; i < files.length; i++) {
                let fileName = files[i].name;
                let itemHtml = 
                    `<div class="file-name">${fileName}</div>`;
                fileList += itemHtml;
            }
            filesWrap.html(fileList);
        });
        //validation
        $('.contact-form').on('change', 'input', function(e){
            let erroreArrayElemnts = [];
            let checkbox = $('.contact-form').find('input[type=checkbox][data-reqired]');
            for (let i = 0; i < checkbox.length; i++) {
                if(!$(checkbox[i]).is(':checked')){
                    erroreArrayElemnts.push(checkbox[i]);
                }
            }
            let inputs = $('.contact-form').find('input[type=text][data-reqired]');
            for (let i = 0; i < inputs.length; i++) {
                if(!$(inputs[i]).val()){
                    erroreArrayElemnts.push(inputs[i]);
                }
            }
            let phone = $('.contact-form').find('.phone-input');
            if(phone.length > 0) {
                if(phone.val()) {
                    if(!validatePhone(phone.val())){
                        erroreArrayElemnts.push(phone);
                    }
                } else {
                    erroreArrayElemnts.push(phone);
                }
            }
            let email = $('.contact-form').find('.email-input');
            if(email.length > 0) {
                if(email.val()) {
                    if(!isEmail(email.val())){
                        erroreArrayElemnts.push(email);
                    }
                } else {
                    erroreArrayElemnts.push(email);
                }
            }
            console.log(erroreArrayElemnts);
            if(erroreArrayElemnts.length === 0){
                $('.form-valid').find('.btn-submit').removeClass('inactive');
            } else {
                $('.form-valid').find('.btn-submit').addClass('inactive');
            }
        });

        var formValid = document.getElementsByClassName('form-valid')[0];
        $('.form-valid').on('click', '.btn-submit', function(e) {
            $(this).parents('form').submit(function (e) {
                e.preventDefault();
                var erroreArrayElemnts = [];
                var el = document.querySelectorAll('.form-valid input[type="radio"][data-reqired]');
                for (var i = 0; i < el.length; i++) {
                    if (el[i].tagName === 'INPUT') {
                        var name = el[i].getAttribute('name');
                        if (document.querySelectorAll('[name=' + name + ']:checked').length === 0) {
                            erroreArrayElemnts.push(el[i]);
                            $(el[i]).parents('.form-group').addClass('has-error');
                            $(el[i]).parents('.form-group').find('.error-text').fadeIn(300);
                            var inputname = $(el[i]).attr('name');
                            $('input[name='+ inputname + ']').change(function (e) {
                                $(this).parents('.form-group').removeClass('has-error');
                                $(this).parents('.form-group').find('.error-text').fadeOut(300);
                            });
                        }
                    }
                }

                if (erroreArrayElemnts.length == 0) {
                    formValid.submit();
                }
                if (erroreArrayElemnts.length > 0) {
                    console.log('Valid error');
                    erroreArrayElemnts.sort(function(a, b){
                        return parseInt($(a).parents('.form-group').offset().top)-parseInt($(b).parents('.form-group').offset().top)
                    });
                    setTimeout(() => {
                        $(erroreArrayElemnts[0]).parents('.form-group').get(0).scrollIntoView({
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            });
        });

        $('form').on('change focusout', '.email-input', function(e){
            if($(this).val()){
                if(!isEmail($(this).val())){
                    $(this).parents('.form-group').find('.error-text').html('Ввведите email в верном формате');
                    $(this).parents('.form-group').addClass('has-error');
                    $(this).parents('.form-group').find('.error-text').fadeIn(300);
                    $(this).focus(function(e){
                        $(this).parents('.form-group').removeClass('has-error');
                        $(this).parents('.form-group').find('.error-text').fadeOut(300);
                    });
                }
            } else {
                $(this).parents('.form-group').addClass('has-error');
                $(this).parents('.form-group').find('.error-text').fadeIn(300);
                $(this).focus(function(e){
                    $(this).parents('.form-group').removeClass('has-error');
                    $(this).parents('.form-group').find('.error-text').fadeOut(300);
                });
            }
        });

        $('form').on('change focusout', '.phone-input', function(e){
            if($(this).val()){
                if(!validatePhone($(this).val())){
                    $(this).parents('.form-group').find('.error-text').html('Ввведите номер телефона в верном формате');
                    $(this).parents('.form-group').addClass('has-error');
                    $(this).parents('.form-group').find('.error-text').fadeIn(300);
                    $(this).focus(function(e){
                        $(this).parents('.form-group').removeClass('has-error');
                        $(this).parents('.form-group').find('.error-text').fadeOut(300);
                    });
                }
            } else {
                $(this).parents('.form-group').addClass('has-error');
                $(this).parents('.form-group').find('.error-text').fadeIn(300);
                $(this).focus(function(e){
                    $(this).parents('.form-group').removeClass('has-error');
                    $(this).parents('.form-group').find('.error-text').fadeOut(300);
                });   
            }
        });

        
        $('form').on('change focusout', '.name-input', function(e){
            if(!$(this).val()){
                $(this).parents('.form-group').find('.error-text').html('Ввведите имя');
                $(this).parents('.form-group').addClass('has-error');
                $(this).parents('.form-group').find('.error-text').fadeIn(300);
                $(this).focus(function(e){
                    $(this).parents('.form-group').removeClass('has-error');
                    $(this).parents('.form-group').find('.error-text').fadeOut(300);
                });
        }
        });

        function isEmail(email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        }
        function validatePhone(txtPhone) {
            var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
            if (filter.test(txtPhone)) {
                return true;
            }
            else {
                return false;
            }
        }

        //only number for phone
        $('.phone-input').inputFilter(function(value) {
            return /^-?\+?\d*$/.test(value) && (value === "" || value);
        });
    });
});
