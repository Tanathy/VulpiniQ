Form.prototype.Radio = function(options = []) {
    if (!Form.radioClassesInitialized) {
        Form.radioClasses = Q.style(null, `
            .form_radio { display: flex; flex-direction: column; gap: 5px; }
            .form_radio_item { display: flex; align-items: center; cursor: pointer;
            color: var(--form-default-text-color);
            font: var(--form-default-text); font-size: var(--form-default-font-size);
            }
            .form_radio_item::before {
                content: "";
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-right: 8px;
                background-color: var(--form-default-background);
                border-radius: 50%;
            }

            .form_radio_item:hover::before {
                outline: 2px solid var(--form-default-accent-color);
            }

            .form_radio_item.selected::before {
                background-color: var(--form-default-accent-color);
            }
            .form_radio_item.disabled {
                opacity: 0.5;
                pointer-events: none;
            }
        `, null, {
            'form_radio': 'form_radio',
            'form_radio_item': 'form_radio_item',
            'selected': 'selected',
            'disabled': 'disabled'
        },false);
        Form.radioClassesInitialized = true;
    }
    const container = Q(`<div class="${Form.radioClasses.form_radio}"></div>`);
    let _options = options.map(o => ({
        value: o.value,
        text: o.text,
        enabled: o.enabled !== false,
        selected: !!o.selected,
        disabled: !!o.disabled
    }));
    let _changeCallback;
    function render() {
        container.empty();
        _options.forEach((opt, idx) => {
            const item = Q(`<div class="${Form.radioClasses.form_radio_item}">${opt.text}</div>`);
            if (opt.selected) item.addClass(Form.radioClasses.selected);
            if (opt.disabled) item.addClass(Form.radioClasses.disabled);
            item.on('click', () => {
                if (opt.disabled) return;
                select(idx);
            });
            opt._el = item;
            container.append(item);
        });
    }
    function select(idx) {
        _options.forEach((o, i) => {
            const sel = i === idx;
            o.selected = sel;
            // explicit single‑select behavior
            if (sel) {
                o._el.addClass(Form.radioClasses.selected);
            } else {
                o._el.removeClass(Form.radioClasses.selected);
            }
        });
        if (_changeCallback) {
            const o = _options[idx];
            _changeCallback(idx, o.value, o.text);
        }
    }
    container.val = function(vals) {
        if (vals === undefined) {
            return _options.map(({_el,...o}) => o);
        }
        _options = vals.map(o => ({
            value: o.value,
            text: o.text,
            enabled: o.enabled !== false,
            selected: !!o.selected,
            disabled: !!o.disabled
        }));
        render();
        return container;
    };
    container.selected = function() {
        const idx = _options.findIndex(o => o.selected);
        const o = _options[idx] || {};
        return { index: idx, value: o.value, text: o.text };
    };
    container.disable = function(idx) {
        const o = _options[idx];
        if (o) { o.disabled = true; o._el.addClass(Form.radioClasses.disabled); }
        return container;
    };
    container.select = function(idx) {
        select(idx);
        return container;
    };
    container.change = function(cb) { _changeCallback = cb; return container; };
    render();
    this.elements.push(container);
    return container;
};
