// Define the Form constructor
function Form(options = {}) {
    if (!(this instanceof Form)) {
        return new Form(options);
    }
    
    // Store form elements and data
    this.elements = [];
    this.options = options;
    
    // Initialize shared styles if not already done
    if (!Form.initialized) {
        Form.classes = Q.style(`
            --form-default-background-color: #fff;
            --form-default-text-color: #000;
            --form-default-border-color: #000;
            --form-default-border-radius: 5px;
        `, `
            .form_icon {
                width: 100%;
                height: 100%;
                color: #fff;
                pointer-events: none;
            }

            .q_form {
                box-sizing: border-box;
                font-family: inherit;
                font-size: inherit;
                color: inherit;
                margin: 1px;
            }

            .q_form_disabled {
                opacity: 0.5;
            }
            
            .form_active {
                background-color: #1DA1F2;
                color: #fff;
            }
        `, null, {
            'form_icon': 'form_icon',
            'q_form': 'q_form',
            'q_form_disabled': 'q_form_disabled',
            'form_active': 'form_active'
        });
        
        Form.initialized = true;
        console.log('Form core initialized');
    }
}

// Add utility methods to the Form prototype
Form.prototype.Icon = function(icon) {
    let iconElement = Q('<div>');
    iconElement.addClass('svg_' + icon + ' form_icon');
    return iconElement;
};

// Add the Form constructor to the global Q object
Q.Form = Form;