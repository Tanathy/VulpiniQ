Q.Form = function (options = {}) {
    // Create the Form namespace
    const Form = {};
    
    // Shared icon function
    Form.Icon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' form_icon');
        return iconElement;
    };

    // Define only basic shared styles
    Form.classes = Q.style(`
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
    `, {
        'form_icon': 'form_icon',
        'q_form': 'q_form',
        'q_form_disabled': 'q_form_disabled'
    });

    // Return the Form namespace to be extended by other components
    return Form;
};