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
    // create textarea without template parsing
    const textarea = Q('<textarea>')
        .addClass(Form.textAreaClasses.form_textarea)
        .attr('placeholder', placeholder)
        .val(value);

    // no need for a separate placeholder() method
    textarea.disabled = function(state) {
        textarea.prop('disabled', state);
        return textarea;
    };
    textarea.reset = function() {
        textarea.val('');
        return textarea;
    };
    // use input for live updates
    textarea.change = function(callback) {
        textarea.on('input', function() {
            callback(this.value);
        });
        return textarea;
    };
    this.elements.push(textarea);
    return textarea;
};