Form.prototype.Button = function(text = '') {
    if (!Form.buttonClassesInitialized) {
        Form.buttonClasses = Q.style(null, `
            .button {
                user-select: none;
                font-family: var(--form-default-font-family);
                background-color: var(--form-default-button-background-color);
                color: var(--form-default-button-text-color);
                box-shadow: inset 0 0 0 1px var(--form-default-button-border-color);
                border-radius: var(--form-default-border-radius);
                padding: var(--form-default-padding);
                font-size: var(--form-default-font-size);
                cursor: pointer;
            }
            .button:hover {
                background-color: var(--form-default-button-hover-background-color);
                color: var(--form-default-button-hover-text-color);
            }
            .button:active {
                background-color: var(--form-default-button-active-background-color);
                color: var(--form-default-button-active-text-color);
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
    return button;
};
