
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
            --form-default-input-background-color:rgb(37, 37, 37);
            --form-default-input-text-color:rgb(153, 153, 153);
            --form-default-input-border-color:rgba(255, 255, 255, 0.03);
            --form-default-checkbox-background-color:rgb(68, 68, 68);
            --form-default-checkbox-active-background-color:rgb(100, 60, 240);
            --form-default-checkbox-text-color:rgb(153, 153, 153);
            --form-default-checkbox-radius: 5px;
            --form-default-button-background-color:rgb(100, 60, 240);
            --form-default-button-text-color: #fff;
            --form-default-button-hover-background-color:rgb(129, 100, 231);
            --form-default-button-hover-text-color: #fff;
            --form-default-button-active-background-color:rgb(129, 100, 231);
            --form-default-button-active-text-color: #fff;
            --form-default-button-border-color:rgba(255, 255, 255, 0.1);
        `, `
            .form_icon {
                width: 100%;
                height: 100%;
                color: #fff;
                pointer-events: none;
            }
        `, null, {});
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