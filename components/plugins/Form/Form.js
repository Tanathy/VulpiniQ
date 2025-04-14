function Form(options = {}) {
    if (!(this instanceof Form)) {
        return new Form(options);
    }
    this.elements = [];
    this.options = options;
    if (!Form.initialized) {
        Form.classes = Q.style(`
            --form-default-border-radius: 5px;
            --form-default-padding: 5px 10px;
            --form-default-font-size: 12px;
            --form-default-font-family: Arial, sans-serif;
            --form-default-input-background-color: rgb(0,0,0,0.1);
            --form-default-input-background-color_active: rgb(0,0,0,0.2);
            --form-default-input-text-color: rgb(153, 153, 153);
            --form-default-input-border-color: rgba(255, 255, 255, 0.03);
            --form-default-checkbox-background-color: rgb(68, 68, 68);
            --form-default-checkbox-active-background-color: rgb(100, 60, 240);
            --form-default-checkbox-text-color: rgb(153, 153, 153);
            --form-default-checkbox-radius: 5px;
            --form-default-button-background-color: rgb(100, 60, 240);
            --form-default-button-text-color: #fff;
            --form-default-button-hover-background-color: rgb(129, 100, 231);
            --form-default-button-hover-text-color: #fff;
            --form-default-button-active-background-color: rgb(129, 100, 231);
            --form-default-button-active-text-color: #fff;
            --form-default-button-border-color: rgba(255, 255, 255, 0.1);
            --form-default-selected-background-color: rgb(100, 60, 240);
            --form-default-selected-text-color: #fff;
            --form-default-dropdown-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            --form-default-dropdown-background-color: rgb(51, 51, 51);

        `, `
            .form_icon {
                width: 100%;
                height: 100%;
                color: #fff;
                pointer-events: none;
            }
            .form_close_button {
                user-select: none;
                -webkit-user-select: none;
                position: absolute;
                top: 0px;
                right: 0px;
                width: 18px;
                height: 18px;
                background-color: rgba(0, 0, 0, 0.5);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                cursor: pointer;
            }
            .form_close_button:hover {
                background-color: rgba(220, 53, 69, 0.8);
            }
            /* New scrollbar customization class */
            .scrollbar::-webkit-scrollbar {
                width: 12px;
            }
            .scrollbar::-webkit-scrollbar-track {
                background:transparent;
            }
            .scrollbar::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 10px;
                border: 3px solid rgb(37, 37, 37);
            }
            .scrollbar {
                scrollbar-color: #888 rgb(48, 48, 48);
            }
        `, null, {
            'q_form': 'q_form',
            'form_icon': 'form_icon',
            'form_close_button': 'form_close_button',
            'scrollbar': 'scrollbar'
        });
        Form.initialized = true;
        console.log('Form core initialized');
    }
}
Form.prototype.Icon = function (icon) {
    let iconElement = Q('<div>');
    iconElement.addClass('svg_' + icon + ' form_icon');
    return iconElement;
};
Q.Form = Form;