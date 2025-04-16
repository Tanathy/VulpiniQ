Form.prototype.CheckBox = function(checked = false, text = '') {
    if (!Form.checkBoxClassesInitialized) {
        Form.checkBoxClasses = Q.style('', `
            .form_checkbox {
                display: flex;
                width: fit-content;
                align-items: center;
            }
            .form_checkbox .label:empty {
                display: none;
            }
            .form_checkbox .label {
                padding-left: 5px;
                user-select: none;
            }
            .form_checkbox_element {
                position: relative;
                width: 20px;
                height: 20px;
                background-color: var(--form-default-checkbox-background-color);
                border-radius: var(--form-default-checkbox-radius);
                cursor: pointer;
            }
            .form_checkbox_element.checked:before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--form-default-checkbox-active-background-color);
                border-radius: var(--form-default-checkbox-radius);
            }
            .form_label {
                padding-left: 5px;
                color: var(--form-default-checkbox-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
            }
            .form_checkbox_element.disabled {
                opacity: 0.5;
                pointer-events: none;
            }
        `, null, {
            'form_checkbox': 'form_checkbox',
            'form_checkbox_element': 'form_checkbox_element',
            'form_label': 'form_label',
            'disabled': 'disabled',
            'checked': 'checked'
        });
        Form.checkBoxClassesInitialized = true;
    }
    let ID = '_' + Q.ID();
    const container = Q('<div class="' + Form.checkBoxClasses.form_checkbox + '">');
    const checkbox_container = Q('<div class="' + Form.checkBoxClasses.form_checkbox_element + '">');
    const labeltext = Q('<div class="' + Form.checkBoxClasses.form_label + '">' + text + '</div>');

    if (checked) {
        checkbox_container.addClass(Form.checkBoxClasses['checked']);
    }
    checkbox_container.on('click', function(){
        if (!checkbox_container.hasClass(Form.checkBoxClasses['disabled'])) {
            const newState = !checkbox_container.hasClass(Form.checkBoxClasses['checked']);
            checkbox_container.toggleClass(Form.checkBoxClasses['checked'], newState);
            if (container._changeCallback) {
                container._changeCallback(newState);
            }
        }
    });
    container.append(checkbox_container, labeltext);

    container.checked = function(state) {
        checkbox_container.toggleClass(Form.checkBoxClasses['checked'], state);
        if (state && container._changeCallback) {
            container._changeCallback(state);
        }
    };
    container.change = function(callback) {
        container._changeCallback = callback;
    };
    container.disabled = function(state) {
        if (state) {
            checkbox_container.addClass(Form.checkBoxClasses['disabled']);
            container.addClass(Form.classes.form_disabled);
        } else {
            checkbox_container.removeClass(Form.checkBoxClasses['disabled']);
            container.removeClass(Form.classes.form_disabled);
        }
    };
    container.text = function(newText) {
        labeltext.text(newText);
    };
    this.elements.push(container);
    return container;
};
