Q.Form.TextArea = function (value = '', placeholder = '') {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    
    // Define TextArea-specific styles
    const classes = Object.assign({}, sharedClasses, Q.style('', `
        .q_form_textarea {
            width: calc(100% - 2px);
            padding: 5px;
            outline: none;
            border: 0;
        }

        .q_form_textarea:focus {
            outline: 1px solid #1DA1F2;
        }
    `, null, {
        'q_form_textarea': 'q_form_textarea'
    }));
    
    const textarea = Q(`<textarea class="${classes.q_form} ${classes.q_form_textarea}" placeholder="${placeholder}">${value}</textarea>`);

    textarea.placeholder = function (text) {
        textarea.attr('placeholder', text);
    };
    
    textarea.disabled = function (state) {
        textarea.prop('disabled', state);

        if (state) {
            textarea.addClass(classes.q_form_disabled);
        } else {
            textarea.removeClass(classes.q_form_disabled);
        }
    };
    
    textarea.reset = function () {
        textarea.val('');
    };
    
    textarea.change = function (callback) {
        textarea.on('change', function () {
            callback(this.value);
        });
    };

    return textarea;
};