Form.prototype.Button = function(text = '') {
    if (!Form.buttonClassesInitialized) {
        Form.buttonClasses = Q.style(null, `
            .button {
                user-select: none;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                background-color: var(--form-default-background);
                color: var(--form-default-text-color);
                border-radius: var(--form-default-border-radius);
                padding: var(--form-default-padding);
            }
            .button:hover {
                background-color: var(--form-default-background-hover);
                color: var(--form-default-text-color-hover);
            }
            .button:active {
                background-color: var(--form-default-background-active);
                color: var(--form-default-text-color-active);
            }
            .button_disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `, null, {
            'button_disabled': 'button_disabled',
            'button': 'button'
        });
        Form.buttonClassesInitialized = true;
    }
    const button = Q(`<div class="${Form.buttonClasses.button}">${text}</div>`);
    button.click = function(callback) {
        button.on('click', callback);
        return button;
    };
    button.disabled = function(state) {
        if (state) {
            button.addClass(Form.buttonClasses.button_disabled);
        } else {
            button.removeClass(Form.buttonClasses.button_disabled);
        }
        return button;
    };
    button.setText = function(newText) {
        button.text(newText);
        return button;
    };
    button.remove = function() {
        button.remove();
        return button;
    };
    this.elements.push(button);

    // enable ripple effect on this button
    this.FX_Ripple(button);

    return button;
};
