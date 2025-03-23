// Add TextArea as a method to the Form prototype
Form.prototype.TextArea = function(value = '', placeholder = '') {
    // Define TextArea-specific styles if not already defined
    if (!Form.textAreaClassesInitialized) {
        Form.textAreaClasses = Q.style('', `
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
        });
        
        Form.textAreaClassesInitialized = true;
    }
    
    const textarea = Q(`<textarea class="${Form.classes.q_form} ${Form.textAreaClasses.q_form_textarea}" placeholder="${placeholder}">${value}</textarea>`);

    textarea.placeholder = function(text) {
        textarea.attr('placeholder', text);
    };
    
    textarea.disabled = function(state) {
        textarea.prop('disabled', state);

        if (state) {
            textarea.addClass(Form.classes.q_form_disabled);
        } else {
            textarea.removeClass(Form.classes.q_form_disabled);
        }
    };
    
    textarea.reset = function() {
        textarea.val('');
    };
    
    textarea.change = function(callback) {
        textarea.on('change', function() {
            callback(this.value);
        });
    };
    
    // Add to form elements
    this.elements.push(textarea);

    return textarea;
};