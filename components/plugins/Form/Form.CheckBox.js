Q.Form.CheckBox = function (checked = false, text = '') {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    
    // Define CheckBox-specific styles
    const classes = Object.assign({}, sharedClasses, Q.style(`
        .q_form_checkbox {
            display: flex;
            width: fit-content;
            align-items: center;
        }

        .q_form_checkbox .label:empty {
            display: none;
        }

        .q_form_checkbox .label {
            padding-left: 5px;
            user-select: none;
        }

        .q_form_cb {
            position: relative;
            width: 20px;
            height: 20px;
            background-color: #555555;
        }

        .q_form_cb input[type="checkbox"] {
            opacity: 0;
            top: 0;
            left: 0;
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .q_form_cb input[type="checkbox"]:checked+label:before {
            content: "";
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #1DA1F2;
        }
    `, {
        'q_form_checkbox': 'q_form_checkbox',
        'q_form_cb': 'q_form_cb'
    }));
    
    let ID = '_' + Q.ID();
    const container = Q('<div class="' + classes.q_form + ' ' + classes.q_form_checkbox + '">');
    const checkbox_container = Q('<div class="' + classes.q_form_cb + '">');
    const input = Q(`<input type="checkbox" id="${ID}">`);
    const label = Q(`<label for="${ID}">${text}</label>`);
    const labeltext = Q(`<div class="label">${text}</div>`);
    checkbox_container.append(input, label);
    container.append(checkbox_container, labeltext);

    container.checked = function (state) {
        input.prop('checked', state);
        if (state) {
            input.trigger('change');
        }
    };

    container.change = function (callback) {
        input.on('change', function () {
            callback(this.checked);
        });
    };

    container.disabled = function (state) {
        input.prop('disabled', state);
        if (state) {
            container.addClass(classes.q_form_disabled);
        } else {
            container.removeClass(classes.q_form_disabled);
        }
    };

    container.text = function (text) {
        labeltext.text(text);
    };

    return container;
};
