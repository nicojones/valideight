# Valideight.js - A real-time form validator for the web #
- - - - - - - - - - - - -

## Includes ##
### Valideight.js ###
Valideight.js provides a real-time form validator for your web page forms.  
Full of features, it allows you to specify up to the slightest detail and restriction in any &lt;input/&gt; field.  

### Valideight.php ###
In addition, `Valideight.js` comes with a back-end form validator, the PHP class `Valideight.php`, that accepts the same parameters as the JS and returns whether the field is valid or not in accordance with the client-side validation.  
This is strongly recommended for delicated registration forms (and similar), since the front-end validation rules can easily be overpassed by an experienced programmer or web user.

- - - - - - - - -
Features

-   [A super-easy to use jQuery plugin](#initialize)
-   [Live validation: warns you as you type](#live-validation)
-   [Fully-customizable form validation, with nittpicky details](#customization)
-   [Custom RegEx validation rules](#regex)
-   [Custom error messages](#error-message)
-   [Does not validate everything: Just add "data-novalideight" to an input or element to exclude it and their children.](#no-validate)
-   [Global parameters](#globals)
-   [Reset validation: set all fields as fresh as new with a simple order](#reset-form)


# Initialize the Valideightor #

### Snippets ###
Include the JS and CSS (optional) files, preferably each of them the last:
    
    <script src="path/to/valideight.js" type="text/javascript"></script>
    
    <!-- Optional but recommended -->
    <link  href="path/to/valideight.css" rel="stylesheet" type="text/css"/>


Now, to automatically initialize `valideight` on a form simply add a `data-valideight` attribute to it:
<!-- language-all: lang-html -->

    <form data-valideight="">
        <!-- Your inputs go here -->
    <form/>
    
On document ready the class `.valideightor` is added to the form and the `data-valideight` attribute is removed.  

### Initialization ###
Its initialization is automatically called after DOM Ready, accepting parameters by default. Those **must** be set under the global variable `var = valideightGlobals` from any script or can also be set directly from the `/* GLOBALS */` section inside the `valideight.js` file (at the top).
<!-- language: lang-js -->

    $(document).ready(function() {
        $("form[data-valideight]").valideight(valideightGlobals);
    });
    
The global settings `valideightGlobals` object can contain the following parameters (though none is mandatory):
<!-- languege: lang-js -->

    valideightGlobals = {
        wrongField : "Please enter a valid value", // default validator message in case data-error is not specified
        successCallback: function() {},            // triggered when validation is OK
        errorCallback: function() {},              // triggered when submitted with wrong fields
        onValideightReady: function() {},          // triggered after valideight.js is ready
        minPassLength: 4,                          // minimum password length for password inputs
        bootstrap: false                           // if using bootstrap, set it to true for a fully-native validator
    };
    
If any of those parameters is specified, it will be overwritten.

**Note**: `successCallback` and `errorCallback` are very interesting functions. If you have a custom function `postComment()` that handles an AJAX form post, calling `postComment()` after the form has been submitted *only if the form is valid* is as easy as `successCallback: postComment`;
Equally easy, you can have a fallback function for wrong submissions, like an alert box or similar.

**Note2**: You can also initialize `valideight` manually, by calling, after document ready:
    
    $("#myForm").valideight(options) // #myForm does NOT have the attribute data-valideight
    
### Nesting structure ###

It is also required to nest each input inside a container with class `.valideight-box`
<!-- language: lang-html -->

    <form data-valideight="">
        <div class="valideight-box">
            <input type="text" .... />
        </div>
        <div class="valideight-box">
            <textarea .... ></textarea>
        </div>
        .....
    </form>
    
**Note**: Good news! In bootstrap, the `div.valideight-box` *coincides* with the `div.form-group`.  

If you want to trigger a form *after* `$(document).ready()`, you must call it manually:
<!-- language: lang-js -->

    $("#myNewForm").valideight();
    
    
### Restart the form and unpaint the fields ###
An invalid input field remains invalid until it is corrected.  
This may seem obvious, but in the case of *form recycling* (using the same form for, for example, editing different comments in a popover) it may happen that, if the popover was closed while having wrong fields, when opened again they may still with the `.has-error` classes.  
To remove this, just restart the form with JavaScript:
<p id="reset-form"></p>
<!-- language: lang-js -->

    $("#myRecycledForm").valideight({callback: 'restart'});    
    

# Live validation #
Whenever an input contains invalid data, the class `.has-error` is added to the parent of the input (the container **valideight-box**) and when the input blurs (i.e. *loses focus*) the class `.has-error-message` is added too.  
(Notice that `.has-error-message` *only* gets appended when the input loses focus).  
Both classes are automatically remove when the input regains valid input data (i.e. when it's  *valid* again).

Using CSS (and hence the importance of the `valideight.css` styes file), the input (or textarea) gets a red border (indicating error) when `.has-error` gets appended and an [error message](#error-message) shows when `.has-error-message` is added. Use your own CSS rules to do wonderful things.

On the contrary, if a user has interacted with a field and such field is now valid, the class `.has-success` will be added to the input parent `.valideight-box`. No custom CSS rules are set, but you can set your own, like painting the field green.

Needless to say for those of you familiarized with Twitter Bootstrap, `Valideight.js` works beautifully with it, since the error classes are completely the same.
For an optimum TB performance, add the `valideight.css` stylesheet and set `bootstrap = true` in the global options configuration variable `valideightGlobals`.


# Input customization #
Valideight.js is populated with a wide range of features (available through attributes) that allow you to customize the behaviour (e.g. valid-invalid inputs).  
Some attributes are generic (i.e. `data-minlength`) and some of them are specific (i.e. `data-datetype`).  

The generic ones are the following:

- `required`: The default required attribute specifies whether it must be filled to be valid or no. In addition to use it for required fields (such as email or password) it is very useful for other inputs (such as the required checkbox for *Terms and conditions*, for example).
- `type`: The HTML-valid types are: 
    * `text`
    * `email`
    * `password`
    * `checkbox` 
    * `radio` 
    * `file`  
    Input type `submit` is useless for the form validator, and other types (such as `number` or `range`) are not recommended, since they may be unreadable from IE. As a workaround, the `data-type` attribute exists.  
    
- `data-type`: This attribute overwrites the **validation** type set by the `type` attribute (overwrites *only* the validation, not the behaviour of the field). In addition to the types specified before (which can be used here, though most of the time there is no point in it), some additional types exist:
    * `number`: Supported by modern browsers (Chrome even adds an up-down selector), this `data-type` will *only* allow numbers. I personally do *not* like the native and prefer to set `type='text' data-type='number'`
    * `date`: This type allows only a date format, being US (YYYY-MM-DD) by default. You can specify European (DD-MM-YYYY) by adding the `data-datetype="EU"` attribute to the field.
    * `url`: With this attribute specified, the field will only be valid if a valid URL is specified (`http`, `https` are optional). Both *www.example.com* and *http://www.example.com/index.html?foo=bar* are valid.
    * `decimal`: This attribute allows only decimal numbers of the form "123.45", "0.1234567" or "98765".
- `data-minlength`: The minimum length of the field. Useful for passwords, names, texts... Setting it to `0` equals to setting the field as required.
- `data-check`: In the case of passwords, a "confirm password" field might be needed. To solve this, add an ID (e.g. `#password`) to the password field and a `data-check="password"` to the "confirm password" input
- `data-datetype`: As specified in the `data-type` attribute, this works in conjunction to `data-type="date"`, and specifies the desired format for the date. It can be `US` (default, DD-MM-YYYY or MM-DD-YYYY) or `EU` (YYYY-MM-DD, the natural one for comparing dates).
- `data-regex`:*If* specified, *it will overwrite* the `valideight.js` pre-set RegEx (such as those for *email*, *number*, ...). Extremely powerful for custom rules (like a password with required numbers, a specific type of username...). *Should* be used with `type="text"` or `type="password"` for optimum performance.  
**Note**: From versions `1.4` and up, the password regex `A-Z a-z 0-9 @?!#._-+` is applied by default. Use `data-regex="none"` to disable it. <p id="regex"></p>

# Custom error messages #
<p id="error-message"></p>
To set a custom error message, add it to the input as a `data-error` attribute. Dynamically on load, a sibling is added to each of the inputs containing such message and it will be shown when a `.has-error` input loses focus. 

**This parameter is required**, so if you want an input field *without* any error message, set `data-error="none"` or `data-error="false"`.  
If `data-error` were not specified, a default "Please enter a valid value" text would be added. This default text can be modified from the global configurations in the `valideight.js` file, and can be overwritten by setting `wrongField : "Hey! Wrong!"` in the options.

# Prevent validation for specific inputs
<p id="no-validate"></p>
It might be desired not to validate some input fields *even if* they belong to a `form.valideight` form. To do so, add the attribute `data-novalideight` to a field or even to a container of many fields.  

Moreover, if inside that container of non-validated fields it is desired to validate a particular one, simply add the attribute `data-forcevalideight` and, even if a parent or itself contains the `novalideight` data attribute, it will flow throught the `Valideight.js` validation rules. 

# Submit the form! #
When submitting the `form` (let's say `#myForm`), two different scenarios are possible:

- AJAX form submission **without** `$("#myForm").on('submit', ...)` event triggered:  
In this case, prior to the AJAX call a validation is needed.  
To do so, validate the form object
<!-- language: lang-js -->
    
        if (valideight($("#myForm"))) {
            // valid form!
            // do your ajax stuff here:
            $.ajax({
               ...
               ... ...
            });
        } else {
            // invalid form! The wrong fields will be automatically highlighted
        }
        
- HTML form submission (i.e. *reloading* the page). If `successCallback : false` in the global options object, the form will be submitted if it is valid, and the page will be reloaded/redirected; if it's not valid, `errorCallback` will be triggered. As easy as that.