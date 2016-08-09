// You can ignore this file, as all it does is print <input/> escaped so you can see the HTML structure

$(document).ready(function() {
    $.each($('input'), function(key, value) {
        var type = $(value).attr('data-type') || $(value).attr('type');

        switch(type) {
            case 'radio':
            case 'submit':
                break;

            default:
                $(value).before(
                    '<pre class="input-preview">' + 
                    value.outerHTML.replace('<', '&lt;').replace('>', '&gt;') + 
                    '</pre>'
                );
                break;
        }

    });
});