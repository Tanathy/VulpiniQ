// Add Button as a method to the Form prototype
Form.prototype.Button = function(text = '') {
    // Define Button-specific styles if not already defined
    if (!Form.buttonClassesInitialized) {
        Form.buttonClasses = Q.style('', `
            .q_form_button {
                user-select: none;
                padding: 5px 10px;
                cursor: pointer;
            }

            .q_form_button:hover {
                background-color: #555;
            }

            .q_form_button:active {
                background-color: #777;
            }
        `, null, {
            'q_form_button': 'q_form_button'
        });
        
        Form.buttonClassesInitialized = true;
    }
    
    const button = Q(`<div class="${Form.classes.q_form} ${Form.buttonClasses.q_form_button}">${text}</div>`);

    button.click = function(callback) {
        button.on('click', callback);
    };

    button.disabled = function(state) {
        if (state) {
            button.addClass(Form.classes.q_form_disabled);
        } else {
            button.removeClass(Form.classes.q_form_disabled);
        }
    };

    // Fix text method to avoid name collision
    button.setText = function(newText) {
        button.text(newText);
        return button;
    };

    button.remove = function() {
        button.remove();
        return button;
    };
    
    // Add to form elements
    this.elements.push(button);

    return button;
};
