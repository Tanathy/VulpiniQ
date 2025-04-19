function Form(options = {}) {
    if (!(this instanceof Form)) {
        return new Form(options);
    }
    this.elements = [];
    this.options = options;
    if (!Form.initialized) {
        Form.classes = Q.style(`

            --form-default-accent-color: rgb(100, 60, 240);
            --form-default-accent-text-color: #fff;
            --form-default-font-size: 12px;
            --form-default-font-family: Arial, sans-serif;

            --form-default-dataset-header-font-weight: 600;
            --form-default-dataset-header-background: rgba(127, 127, 127, 0.24);
            --form-default-dataset-header-background-active: rgba(127, 127, 127, 0.24);
            --form-default-dataset-header-background-focus: rgba(127, 127, 127, 0.24);
            --form-default-dataset-header-background-hover: rgba(127, 127, 127, 0.24);
            --form-default-dataset-header-text-color: #fff;
            --form-default-dataset-header-text-color-active: #fff;
            --form-default-dataset-header-text-color-focus: #fff;
            --form-default-dataset-header-text-color-hover: #fff;
            --form-default-dataset-border: 1px solid rgba(127, 127, 127, 0.24);
            --

            --form-default-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
            --form-default-shadow-active: 0px 0px 5px rgba(100, 60, 240, 0.5);
            --form-default-shadow-focus: 0px 0px 5px rgba(100, 60, 240, 0.5);
            --form-default-shadow-hover: 0px 0px 5px rgba(100, 60, 240, 0.5);

            --form-default-background-active: rgb(46, 46, 46);
            --form-default-background-focus: rgb(46, 46, 46);
            --form-default-background-hover: rgb(46, 46, 46);
            --form-default-background: rgb(46, 46, 46);

            --form-default-border-active: 1px solid var(--form-default-accent-color);
            --form-default-border-focus: 1px solid var(--form-default-accent-color);
            --form-default-border-hover: 1px solid var(--form-default-accent-color);
            --form-default-border: 1px solid rgba(255, 255, 255, 0.03);

            --form-default-outline-active: var(--form-default-border-active);
            --form-default-outline-focus: var(--form-default-border-focus);
            --form-default-outline-hover: var(--form-default-border-hover);
            --form-default-outline: var(--form-default-border);
            
            --form-default-border-radius: 5px;
            --form-default-margin: 0px 0px 0px 0px;
            --form-default-padding: 5px 10px 5px 10px;
            
            
            --form-default-text-color-active: #fff;
            --form-default-text-color-focus: #fff;
            --form-default-text-color-hover: #fff;
            --form-default-text-color: #999;
            
            --form-default-text-active: normal var(--form-default-font-size) var(--form-default-font-family);
            --form-default-text-focus: normal var(--form-default-font-size) var(--form-default-font-family);
            --form-default-text-hover: normal var(--form-default-font-size) var(--form-default-font-family);
            --form-default-text: normal var(--form-default-font-size) var(--form-default-font-family);
            
            --form-default-width: 100%;

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
            /* ripple effect container */
            .form_ripple_container {
                position: relative;
                overflow: hidden;
            }
            .form_ripple_container::after {
                content: '';
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                width: var(--ripple-size);
                height: var(--ripple-size);
                top: var(--ripple-y);
                left: var(--ripple-x);
                transform: scale(0);
            }
            .form_ripple_container.rippleing::after {
                animation: form_ripple 0.4s linear;
            }
            @keyframes form_ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `, null, {
            // 'q_form': 'q_form',
            'form_icon': 'form_icon',
            'form_close_button': 'form_close_button',
            'scrollbar': 'scrollbar',
            'form_ripple_container': 'form_ripple_container',
            'rippleing': 'rippleing'
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
/* FX_Ripple: pseudo‑element approach */
Form.prototype.FX_Ripple = function(el) {
    const element = el instanceof Q ? el.nodes[0] : el;
    if (!element) return this;
    if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    element.classList.add(Form.classes.form_ripple_container);
    element.addEventListener('click', function(e) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        element.style.setProperty('--ripple-size', size + 'px');
        element.style.setProperty(
            '--ripple-x',
            (e.clientX - rect.left - size/2) + 'px'
        );
        element.style.setProperty(
            '--ripple-y',
            (e.clientY - rect.top  - size/2) + 'px'
        );
        element.classList.add(Form.classes.rippleing);
        setTimeout(() => {
            element.classList.remove(Form.classes.rippleing);
        }, 400);
    });
    return this;
};

Q.Form = Form;