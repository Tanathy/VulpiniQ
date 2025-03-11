Q.Form.Button = function (text = '') {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    
    // Define Button-specific styles
    const classes = Object.assign({}, sharedClasses, Q.style(`
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
    `, {
        'q_form_button': 'q_form_button'
    }));
    
    const button = Q(`<div class="${classes.q_form} ${classes.q_form_button}">${text}</div>`);

    button.click = function (callback) {
        button.on('click', callback);
    };

    button.disabled = function (state) {
        if (state) {
            button.addClass(classes.q_form_disabled);
        }
        else {
            button.removeClass(classes.q_form_disabled);
        }
    };

    button.text = function (text) {
        button.text(text);
    };

    button.remove = function () {
        button.remove();
    };

    return button;
};
