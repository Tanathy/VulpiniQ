Form.prototype.TextBox = function(type = 'text', value = '', placeholder = '') {
    if (!Form.textBoxClassesInitialized) {
        Form.textBoxClasses = Q.style('', `
            .q_form_input {
                width: 100%;
                font-family: var(--form-default-font-family);
                padding: var(--form-default-padding);
                font-size: var(--form-default-font-size);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-background);
                color: var(--form-default-text-color);
                border: 0;
                resize: none;
                transition: background-color 0s ease, color 0s ease, outline 0s ease;
            }
            
            /* Fix for autofill background color */
            .q_form_input:-webkit-autofill,
            .q_form_input:-webkit-autofill:hover,
            .q_form_input:-webkit-autofill:focus,
            .q_form_input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 30px var(--form-default-background) inset !important;
                -webkit-text-fill-color: var(--form-default-text-color) !important;
                transition: background-color 5000s ease-in-out 0s;
                background-color: var(--form-default-background) !important;
            }
            
            .q_form_input:hover {
                outline: var(--form-default-outline-hover);
                background-color: var(--form-default-background-hover);
            }
            
            .q_form_input:hover:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 30px var(--form-default-background-hover) inset !important;
                background-color: var(--form-default-background-hover) !important;
            }
            
            .q_form_input:focus {
                outline: var(--form-default-outline-focus);
                background-color: var(--form-default-background-focus);
            }
            
            .q_form_input:focus:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 30px var(--form-default-background-focus) inset !important;
                background-color: var(--form-default-background-focus) !important;
            }
            
            .q_form_input:active {
                outline: var(--form-default-outline-active);
                background-color: var(--form-default-background-active);
            }
            
            .q_form_input:disabled {
                background-color: var(--form-default-background-disabled);
                color: var(--form-default-text-color-disabled);
                cursor: not-allowed;
            }

        `, null, {
            'q_form_input': 'q_form_input'
        });
        Form.textBoxClassesInitialized = true;
    }
    const input = Q(`<input class="${Form.textBoxClasses.q_form_input}" type="${type}" placeholder="${placeholder}" value="${value}">`);
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
        input.on('change input', function() {
            callback(this.value);
        });
    };
    this.elements.push(input);

    return input;
};
