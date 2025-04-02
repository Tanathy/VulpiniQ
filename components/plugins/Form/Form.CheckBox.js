Form.prototype.CheckBox = function(checked = false, text = '') {
    if (!Form.checkBoxClassesInitialized) {
        Form.checkBoxClasses = Q.style('', `
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
                background-color: var(--form-default-checkbox-background-color);
                border-radius: var(--form-default-checkbox-radius);
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
                background-color: var(--form-default-checkbox-active-background-color);
                border-radius: var(--form-default-checkbox-radius);
            }
                .q_form_label {
                padding-left: 5px;
                color: var(--form-default-checkbox-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
            }
        `, null, {
            'q_form_checkbox': 'q_form_checkbox',
            'q_form_cb': 'q_form_cb',
            'q_form_label': 'q_form_label'
        });
        Form.checkBoxClassesInitialized = true;
    }
    let ID = '_' + Q.ID();
    const container = Q('<div class="' + Form.classes.q_form + ' ' + Form.checkBoxClasses.q_form_checkbox + '">');
    const checkbox_container = Q('<div class="' + Form.checkBoxClasses.q_form_cb + '">');
    const input = Q(`<input type="checkbox" id="${ID}">`);
    const label = Q(`<label for="${ID}"></label>`);
    const labeltext = Q(`<div class="${Form.checkBoxClasses.q_form_label}">${text}</div>`);
    if (checked) {
        input.prop('checked', true);
    }
    checkbox_container.append(input, label);
    container.append(checkbox_container, labeltext);
    container.checked = function(state) {
        input.prop('checked', state);
        if (state) {
            input.trigger('change');
        }
    };
    container.change = function(callback) {
        input.on('change', function() {
            callback(this.checked);
        });
    };
    container.disabled = function(state) {
        input.prop('disabled', state);
        if (state) {
            container.addClass(Form.classes.q_form_disabled);
        } else {
            container.removeClass(Form.classes.q_form_disabled);
        }
    };
    container.text = function(text) {
        labeltext.text(text);
    };
    this.elements.push(container);
    return container;
};
