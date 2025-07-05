Form.prototype.TextArea = function(value = '', placeholder = '') {
    if (!Form.textAreaClassesInitialized) {
        Form.textAreaClasses = Q.style('', `
            .form_textarea {
                width: 100%;
                padding: var(--form-default-padding);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-background);
                color: var(--form-default-text-color);
                outline: var(--form-default-outline);
                border: 0;
                resize: none;
                min-height: 100px;
            }
            .form_textarea:focus {
                outline: var(--form-default-outline-focus);
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
    textarea.resizeable = function(x = true, y = true) {
        textarea.css('resize', (x ? 'horizontal' : 'none') + ' ' + (y ? 'vertical' : 'none'));
        return textarea;
    }
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