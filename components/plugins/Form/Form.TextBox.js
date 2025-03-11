Q.Form.TextBox = function (type = 'text', value = '', placeholder = '') {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    
    // Define TextBox-specific styles
    const classes = Object.assign({}, sharedClasses, Q.style(`
        .q_form_input { 
            width: calc(100% - 2px);
            padding: 5px;
            outline: none;
            border: 0;
        }

        .q_form_input:focus {
            outline: 1px solid #1DA1F2;
        }
    `, {
        'q_form_input': 'q_form_input'
    }));
    
    const input = Q(`<input class="${classes.q_form} ${classes.q_form_input}" type="${type}" placeholder="${placeholder}" value="${value}">`);

    input.placeholder = function (text) {
        input.attr('placeholder', text);
    };
    
    input.disabled = function (state) {
        input.prop('disabled', state);

        if (state) {
            input.addClass(classes.q_form_disabled);
        } else {
            input.removeClass(classes.q_form_disabled);
        }
    };
    
    input.reset = function () {
        input.val('');
    };
    
    input.change = function (callback) {
        input.on('change', function () {
            callback(this.value);
        });
    };

    return input;
};
