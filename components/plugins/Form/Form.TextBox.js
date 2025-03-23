// Add TextBox as a method to the Form prototype
Form.prototype.TextBox = function(type = 'text', value = '', placeholder = '') {
    // Define TextBox-specific styles if not already defined
    if (!Form.textBoxClassesInitialized) {
        Form.textBoxClasses = Q.style('', `
            .q_form_input { 
                width: calc(100% - 2px);
                padding: 5px;
                outline: none;
                border: 0;
            }

            .q_form_input:focus {
                outline: 1px solid #1DA1F2;
            }
        `, null, {
            'q_form_input': 'q_form_input'
        });
        
        Form.textBoxClassesInitialized = true;
    }
    
    const input = Q(`<input class="${Form.classes.q_form} ${Form.textBoxClasses.q_form_input}" type="${type}" placeholder="${placeholder}" value="${value}">`);

    input.placeholder = function(text) {
        input.attr('placeholder', text);
    };
    
    input.disabled = function(state) {
        input.prop('disabled', state);

        if (state) {
            input.addClass(Form.classes.q_form_disabled);
        } else {
            input.removeClass(Form.classes.q_form_disabled);
        }
    };
    
    input.reset = function() {
        input.val('');
    };
    
    input.change = function(callback) {
        input.on('change', function() {
            callback(this.value);
        });
    };
    
    // Add to form elements
    this.elements.push(input);

    return input;
};
