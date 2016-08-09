/** GLOBALS */
    var valideightGlobals = valideightGlobals || {};
    
    //they are set with var foo = foo || "bar"; to allow them to be set from the HTML itself or even another script without being overwritten here! :-)
    //And don't forget to set Valideight.js as your last script, to avoid conflicts.
/****************************************************/
    
/** Valideight global vars. Do not touch */    
    var areTooltips = false, 
        zIndex = 100;    
    
/**
 * Customizes (initialises) the form adding the custom classes needed for JS.
 * It is VERY important to run this function each time a &lt;form/&gt; that needs to
 *    be 'valideighted' is added to the DOM.
 * @param e object. RTFM
 */
$.fn.valideight = function(e) {
    var form = $(this), e = e || {};
    if (typeof e.callback === 'function') {
        // this way we can call custom functions from outside
        window[e.callback]();
        return true;
    }

    var options = {
        wrongField : e.wrongField || "Please enter a valid value",
        successCallback: e.successCallback || function() { /*alert("Everything OK!");*/ },
        errorCallback: e.errorCallback || function() { /*alert("Wrong fields!");*/ },
        onValideightReady: e.onValideightReady || function() {/*console.log("Valideight.js loaded!")*/},
        minPassLength: e.minPassLength || 4, // Minimum length for the password
        bootstrap: e.bootstrap || false, // set to true if you're using bootstrap!
        responsiveSize: e.responsiveSize || 600,
        dataTooltip: e.dataTooltip || 'tooltip' // the data-(...) to use for tooltips, in case there is a conflict with user data-attributes.
    };
    
    restart = function() {
        if (options.bootstrap) {
            form.find(".valideight-box").each(function() {
                $(this).addClass("has-feedback");
            })
        }
//        console.log("restarting everything", form);
        //general initialization for all NOT INITIALIZED valideight forms from the DOM
        form.find(".valideight-box").each(function() {
            $(this).removeClass("has-error has-error-message has-success");
        });
        form.find(".error-block").each(function() {
//            console.log("error", $(this));
            $(this).remove();
        });
        form.find("input:not([type='hidden'], [type='submit'], [type='']), textarea, *[data-forcevalideight]").each(function() {
            var inp = $(this);
            var check = inp.attr("required") || inp.data('required') || false;
            var error = inp.data('error') || options.wrongField || false;
            if (inp.attr('type') === 'submit') inp.attr("data-novalideight","");
    //        console.log(this.id, error);
            if (typeof check !== 'undefined' && check !== false && this.type === "radio") 
                inp.attr("checked", "checked"); //checkmark the required radiobuttons, to avoid form submission without any selected button...!
            if (error && error !== "none" && error !== "false") {
                inp.after("<p class='error-block'>" + error + "</p>");
            }
            if (options.bootstrap) {
                inp.after('<span class="glyphicon glyphicon-ok form-control-feedback">' +
                    '</span><span class="glyphicon glyphicon-remove form-control-feedback">');
            }
        });
    };
    
    /**
     * returns TRUE if INPUT is valid, FALSE otherwise, based on the custom rules.
     * remember the minimum password length is set at the Global Variables at the top of this script.
     *
     * You can add custom data-type and set your own validation rules here.
     * @param input The DOM input field
     */
    checkValideightInput = function(input) {

//        console.log("input.required is: ", input.required, " for the input " + input.name)
        var type   = $(input).attr('data-type') || input.type, // type of input (text, number, password... and date)
            val    = (typeof input.value === 'undefined' ? input.innerHTML : input.value) || "", // :-)
            minLen = $(input).attr('data-minlength') || false, //minimum input length
            notReq = !($(input).attr('required') || !!$(input).attr('data-required')) && (val.length === 0), // TRUE if (not required && empty), i.e. VALID
            cRegEx = $(input).attr('data-regex') || input.pattern || false, //if set, it will validate using the custom regex expression
            check  = $(input).attr('data-check') || false;
//        console.log(input);
//        console.log("value: ", val);
//        console.log("type: ", type);
//        console.log("notReq: ",notReq);
        // console.log(type + " ----- " + check + " -- " + notReq + " -- ");
        if (check) { // this means we are checking that two fields match, like a confirm Password or confirm Email
             return Boolean(document.getElementById(check).value === val);
        }
        if(notReq) {
            return true; // this means it is a VALID field
        }
        if (minLen && (val.length < minLen)) {
            return false; // returns false if the input length is shorter than min required.
        }

        switch (type) {
            case "text":
            case "textarea":
                if (cRegEx) {
                    var match = val.match(cRegEx) || false;
                    return Boolean(match);
                }
                else return Boolean(val.length);
                break;

            case "password":
                // returns true if val matches the regex for password AND is longer than required length
                // remember that minPassLength = 4 is set on options.
                var match = true;
                if (cRegEx && !(cRegEx == 'none' || cRegEx == 'false')) {
                    cRegEx = cRegEx || /^[a-zA-Z0-9\-_\?!\*@#\.\+]+$/; //allowed: a-z, A-Z, 0-9, -_?!*@#.+
                    match = val.match(cRegEx) || false;
                }
                return Boolean(match && (val.length >= (options.minPassLength)));
                break;

            case "checkbox":
                return notReq ? true : $(input).is(":checked");
                break;

            case "radio":
                //the $.fn.formValideight() has already selected a radio. So we're fine
                return true;
                break;

            case "number":
                //we return TRUE if val is a number.
                return (!isNaN(val) && val !== ""); // true if (isANumber === true)
                break;

            case "decimal":
                //we return TRUE if val is a decimal number.
                cRegEx = cRegEx || /^[0-9]+(\.[0-9]+)?$/;
                var match = val.match(cRegEx) || false;
                return Boolean(match);
                break;

            case "email":
                // returns true if val matches the regex for email
                cRegEx = cRegEx || /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5})$/gi;
                // var execute = regex.exec(val);
                var match = val.match(cRegEx) || false;
                console.log("email", match);
                return Boolean(match);
                break;

            case "url":
                cRegEx = cRegEx || /^(((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w\-\_\+]*))?)$/;
                var match = val.match(cRegEx) || false;
                console.log(match)
                return Boolean(match);
                break;

            case "date":
                var dateType = $(input).attr('data-datetype') || "US" || "EU"; //Custom, US (YYYY-MM-DD) or European (DD-MM-YYYY)
                switch (dateType) {
                    case "US":
                        cRegEx = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/;
                        break;

                    case "EU":
                        cRegEx = /^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/;
                        break;

                    default:
                        //custom regex!!!
                        cRegEx = dateType;
                        break;
                }
                var match = val.match(cRegEx) || false;
                return Boolean(match);
                break;

            case "file":
                return (val.length ? true : false);
                break;

            default:
                // Why check a field that doesn't match ANY type? :-)
                // type="submit", type="hidden", and also "reset", "button", "foo"
                return true;
                break
        }
    };

    /**
     * "Paints" the input and its span.error with the error,
     * or, if none, removes its (possible) paint
     * @param input the DOM input field
     * @param blur Whether we want to valideight the field after a keypress(false) or a field blur(true)
     * @param error tells if you want to show the span.error or just the input.error field. Useful for "live"
     *        validation, for you only need to show the error message on blur or on on submission
     */
    paintFields = function(input, blur) {
        // no need to check anything if we don't want to show errors...
        var parent = $(input).closest(".valideight-box");
         
        if (checkValideightInput(input)) {
            parent.removeClass("has-error has-error-message")
                    .addClass("has-success");
            return true;
        }
        else {
            parent.removeClass("has-success").addClass("has-error");
            // if we are blurring the field, we must add the error label:
            if (blur) parent.addClass("has-error-message");
            return false;
        }
    };

    /**
     * Validates all input fields in the given form
     * @param form . The jQuery object $(form) to validate.
     */
    valideightForm = function(form) {
        // console.log(form);
        var parent = parent || false;
        var req    = form.find("input:not([data-novalideight] input, input[data-novalideight]), " +
                     "textarea:not([data-novalideight] textarea, textarea[data-novalideight]), " +
                     "*[data-forcevalideight]");
        var errors = false;
        for (var i = 0; i < req.length; ++i) {
            // console.log(req[i]);
            correct = paintFields(req[i], true);
            if (!correct) { //if we have a wrong field...
                errors = true;
            }
        }
        if (!errors) return true;
        else return false;
    };

    /**
     * Triggers on form submission and processes the validation
     */
    this.on("submit", function(e) {
        console.info("Submitted! ... Validating function ...");
        //submitting form
        var valid = valideightForm($(this));
        if (valid === true) {
            console.info("Valid!")
            if (typeof options.successCallback === 'function') {
                e.preventDefault(); e.stopPropagation();
                options.successCallback();
            }
            return true;
        } else if (valid === false) {
            console.warn("Not valid!");
            options.errorCallback();
            return false;
        }
        else return "crocodiles love to procastinate";
    });

    /**
     * General DOM listeners
     */
    // Fields that we do NOT want to validate
    this.on("keyup", "input:not([data-novalideight] input, input[data-novalideight]), " +
                     "textarea:not([data-novalideight] textarea, textarea[data-novalideight])" , function() {
        paintFields(this, false);
    });
//    field
    this.on("blur",  "input:not([data-novalideight] input, input[data-novalideight]), " +
                     "textarea:not([data-novalideight] textarea, textarea[data-novalideight]), " +
                     "*[data-forcevalideight]", function() {
        paintFields(this, true);
    });

    restart(); // start or restart valideight() without reloading listeners
    form.attr("novalidate", "").addClass("valideight").removeAttr("data-valideight");
    if (typeof options.onValideightReady === 'function') {
        options.onValideightReady();
    }
};

function tooltipTop() {
    var d = $(document), ww = $(window).width();
    d.find('[data-tooltip]').each(function() {
//        console.log(this);
        areTooltips = true;
        var e = $(this), cn = e[0].localName, inp = (cn == 'input' || cn == 'textarea' || cn == 'option' || cn == 'button'), 
            tooltip = e.data(options.dataTooltip) || false, self = ((e.data(options.dataTooltip + '-parent') === 'self') && (ww >= options.responsiveSize)),
            left = (self ? 10 : (inp ? 35 : (ww <= options.responsiveSize ? 25 : 5)));
            console.log(cn, inp, self);
        if (tooltip) {
            e.removeAttr("data-" + options.dataTooltip).removeAttr('data-' + options.dataTooltip + '-parent').before(
                "<a class='valideightorTooltip " + (self ? 'self' : '') + "' style='left:" + (e.position().left + e.width() + left) + "px'>" +
                    (self ? "" : "<b>?</b>" ) + "<p class=''>" + tooltip + "</p>" + 
                "</a>");
            if (self) {
                e.addClass('tooltipParent');
            }
        }
    });
        
    if (areTooltips) {
        if (ww >= options.responsiveSize) {
            d.on('mouseenter mouseleave',".valideightorTooltip, .tooltipParent",function(e) {
                var t = $(this), self = t.hasClass('valideightorTooltip'), p = (self ? t.children('p') : t.prev().children('p'));
                if (e.type === 'mouseenter') {
                    var side = (ww - t.offset().left + t.width() > 200) ? "right" : "left";
                    if (!p.hasClass(side)) {
                        var top = (p.height()/(-2) - 20);
    //                        left =  t.position().left + t.width() + 20;
                        p.addClass(side).css({top: top});
                    }
                    p.css({'z-index': ++zIndex}).stop(true,true).fadeIn(100);
                } else {
                    p.stop(true,true).delay(300).fadeOut(200); 
                }
        });
        } else {
            d.on('click','.valideightorTooltip', function(e) {
               e.preventDefault();
               e.stopPropagation();
               var p = $(this).children('p'); 
               var top = (p.height()/(-2) - 20 ) + 'px';
               p.css({top:top,'z-index':++zIndex}).toggle().addClass((ww - $(this).offset().left > 200) ? "right" : "left");
            });
        }
    }
}

$(document).ready(function() {
    //on DOM Ready, with tooltips
    $("form[data-valideight]").valideight(valideightGlobals);
//    tooltipTop();
    // If you do not want to use tooltips:
    //$("form[data-valideight]").valideight();
});