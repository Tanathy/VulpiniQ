
Form.prototype.TextArea = function(value = '', placeholder = '') {
    if (!Form.textAreaClassesInitialized) {
        Form.textAreaClasses = Q.style('', `
            .form_textarea {
                width: 100%;
                padding: var(--form-default-padding);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                color: var(--form-default-input-text-color);
                border: 1px solid var(--form-default-input-border-color);
                resize: none;
                min-height: 100px;
            }
            .form_textarea:focus {
                border-color: var(--form-default-button-background-color);
                outline: none;
            }
        `, null, {
            'form_textarea': 'form_textarea'
        });
        Form.textAreaClassesInitialized = true;
    }
    const textarea = Q(`<textarea class="${Form.classes.q_form} ${Form.textAreaClasses.form_textarea}" placeholder="${placeholder}">${value}</textarea>`);
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
    this.elements.push(textarea);
    return textarea;
};