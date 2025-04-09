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
                cursor: pointer;
            }
            .q_form_cb.checked:before {
                content: "";
                position: absolute;
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
            .q_form_cb.disabled {
                opacity: 0.5;
                pointer-events: none;
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
    const labeltext = Q('<div class="' + Form.checkBoxClasses.q_form_label + '">' + text + '</div>');

    if (checked) {
        checkbox_container.addClass('checked');
    }
    checkbox_container.on('click', function(){
        if (!checkbox_container.hasClass('disabled')) {
            const newState = !checkbox_container.hasClass('checked');
            checkbox_container.toggleClass('checked', newState);
            if (container._changeCallback) {
                container._changeCallback(newState);
            }
        }
    });
    container.append(checkbox_container, labeltext);

    container.checked = function(state) {
        checkbox_container.toggleClass('checked', state);
        if (state && container._changeCallback) {
            container._changeCallback(state);
        }
    };
    container.change = function(callback) {
        container._changeCallback = callback;
    };
    container.disabled = function(state) {
        if (state) {
            checkbox_container.addClass('disabled');
            container.addClass(Form.classes.q_form_disabled);
        } else {
            checkbox_container.removeClass('disabled');
            container.removeClass(Form.classes.q_form_disabled);
        }
    };
    container.text = function(newText) {
        labeltext.text(newText);
    };
    this.elements.push(container);
    return container;
};
