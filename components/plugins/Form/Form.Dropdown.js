Form.prototype.Dropdown = function(options = {}) {
    if (!Form.dropdownStyles) {
        Form.dropdownStyles = Q.style('', `
            .form_dropdown {
                position: relative;
                width: 100%;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                cursor: pointer;
                user-select: none;
                outline: var(--form-default-outline);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-background);
                color: var(--form-default-text-color);
            }
            .selected_text {
            padding-right: 10px;
        }
            .form_dropdown.disabled {
                opacity: 0.6;
                cursor: not-allowed;
                pointer-events: none;
            }
            .form_dropdown_selected {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--form-default-padding);
                line-height: normal;
                cursor: pointer;
                user-select: none;
                width: 100%;
                box-sizing: border-box;
            }
            .form_dropdown_items {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 3px;
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
                background-color: var(--form-default-background);
                outline: var(--form-default-outline);
                border-radius: var(--form-default-border-radius);
                box-shadow: var(--form-default-shadow);
                display: none;
                color: var(--form-default-text-color);
                font-family: var(--form-default-font-family);
            }
            .form_dropdown_item {
                padding: var(--form-default-padding);
                cursor: pointer;
            }
            .form_dropdown_item:hover {
                background-color: var(--form-default-accent-color);
                color: var(--form-default-accent-text-color);
            }
            .form_dropdown_item.selected {
                background-color: var(--form-default-selected-background-color);
                color: var(--form-default-selected-text-color);
                font-weight: 500;
            }
            .form_dropdown_items {
                display: none;
            }
            .form_dropdown_arrow {
                transition: transform 0.2s ease-in-out;
                transform: scale(2.0);
            }
            .form_dropdown.open .form_dropdown_arrow {
                transform: rotate(180deg) scale(2.0);
            }
            .form_dropdown.open .form_dropdown_items {
                display: block;
                position: absolute;
                width: 100%;
                z-index: 1000;
                overflow-y: auto;
                top: 100%;
            }
            .form_dropdown.up .form_dropdown_items {
                top: auto;
                bottom: 100%;
                margin-top: 0;
                margin-bottom: 3px;
            }
        `, null, {
            'selected_text': 'selected_text',
            'form_dropdown': 'form_dropdown',
            'open': 'open',
            'disabled': 'disabled',
            'selected': 'selected',
            'form_dropdown_selected': 'form_dropdown_selected', 
            'form_dropdown_items': 'form_dropdown_items',
            'form_dropdown_item': 'form_dropdown_item',
            'form_dropdown_arrow': 'form_dropdown_arrow',
            'up': 'up'
        },true);
    }
    const container = Q('<div>').addClass(Form.dropdownStyles['form_dropdown']);
    const header = Q('<div>').addClass(Form.dropdownStyles['form_dropdown_selected']);
    const label = Q('<div>').text('Select an option').addClass(Form.dropdownStyles['selected_text']);
    const arrow = Q('<div>').addClass(Form.dropdownStyles['form_dropdown_arrow']).html('&#9662;');
    header.append(label, arrow);
    const listContainer = Q('<div>')
        .addClass(Form.dropdownStyles['form_dropdown_items'])
        .addClass(Form.classes['scrollbar']);
    // always append the items container once
    container.append(header, listContainer);
    // one‐time outside‐click listener to close any open dropdown
    if (!Form.dropdownCloseListenerInitialized) {
        Q(document).on('click', () => {
            Q('.' + Form.dropdownStyles['form_dropdown'])
              .removeClass(Form.dropdownStyles['open']);
        });
        Form.dropdownCloseListenerInitialized = true;
    }
    if (options['max-height']) {
        listContainer.css('maxHeight', options['max-height'] + 'px');
    }
    let selectedValue = null;
    let selectedText = '';
    let selectedIndex = -1;
    let isDisabled = options.disabled || false;
    let changeCallback = options.change || null;
    if (isDisabled) { container.addClass(Form.dropdownStyles['disabled']); }
    // swap below/above on open if needed
    header.on('click', function(e) {
        e.stopPropagation();
        if (isDisabled) return;
        const openCl = Form.dropdownStyles['open'];
        const upCl = Form.dropdownStyles['up'];
        if (container.hasClass(openCl)) {
            // about to close: clear any upward flip
            container.removeClass(upCl);
        } else {
            // about to open: measure and flip if overflowing
            const rect = container.nodes[0].getBoundingClientRect();
            const itemsH = listContainer.nodes[0].scrollHeight;
            if (rect.bottom + itemsH > window.innerHeight) {
                container.addClass(upCl);
            } else {
                container.removeClass(upCl);
            }
        }
        container.toggleClass(openCl);
    });
    // selectItem now just closes via class toggle
    function selectItem(index) {
        const items = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
        if (!items) return;
        items.removeClass(Form.dropdownStyles['selected']);
        const item = items.eq(index);
        if (item.hasClass(Form.dropdownStyles['disabled'])) return;
        item.addClass(Form.dropdownStyles['selected']);
        selectedValue = item.attr('data-value');
        selectedText  = item.text();
        selectedIndex = index;
        label.text(selectedText);
        container.removeClass(Form.dropdownStyles['open']);
        if (typeof changeCallback === 'function') {
            changeCallback(selectedValue, selectedText, selectedIndex);
        }
    }
    if (options.values && Array.isArray(options.values)) {
        setValues(options.values);
    }
    function setValues(values) {
        listContainer.html('');
        let defaultIndex = -1;
        if (!Array.isArray(values) || values.length === 0) { return; }
        values.forEach((item, index) => {
            if (!item || typeof item !== 'object' || item.value === undefined || item.text === undefined) { return; }
            const dropdownItem = Q('<div>')
                .addClass(Form.dropdownStyles['form_dropdown_item'])
                .attr('data-value', item.value)
                .text(item.text);
            if (item.disabled) { dropdownItem.addClass(Form.dropdownStyles['disabled']); }
            if (item.default) { defaultIndex = index; }
            dropdownItem.on('click', function(e) {
                e.stopPropagation();
                if (!dropdownItem.hasClass(Form.dropdownStyles['disabled'])) {
                    selectItem(index);
                }
            });
            listContainer.append(dropdownItem);
        });
        // default to first if none marked
        if (defaultIndex < 0) defaultIndex = 0;
        selectItem(defaultIndex);
    }
    const dropdownAPI = {
        val: function(values) {
            if (values === undefined) {
                return { value: selectedValue, text: selectedText, index: selectedIndex };
            }
            setValues(values);
            return this;
        },
        change: function(callback) {
            changeCallback = callback;
            return this;
        },
        disabled: function(state) {
            isDisabled = !!state;
            if (isDisabled) { container.addClass(Form.dropdownStyles['disabled']); }
            else { container.removeClass(Form.dropdownStyles['disabled']); }
            return this;
        },
        select: function(index) {
            selectItem(index);
            return this;
        },
        index: function(index) {
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            if (index >= 0 && index < items.length) {
                const item = Q(items[index]);
                return { value: item.attr('data-value'), text: item.text() };
            }
            return null;
        },
        disable: function(indexes) {
            if (!Array.isArray(indexes)) return this;
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            indexes.forEach(idx => {
                if (idx >= 0 && idx < items.length) {
                    Q(items[idx]).addClass(Form.dropdownStyles['disabled']);
                }
            });
            return this;
        },
        enable: function(indexes) {
            if (!Array.isArray(indexes)) return this;
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            indexes.forEach(idx => {
                if (idx >= 0 && idx < items.length) {
                    Q(items[idx]).removeClass(Form.dropdownStyles['disabled']);
                }
            });
            return this;
        },
        text: function(index, newText) {
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            if (index >= 0 && index < items.length) {
                const item = Q(items[index]);
                item.text(newText);
                if (index === selectedIndex) {
                    selectedText = newText;
                    label.text(newText);
                }
            }
            return this;
        },
        add: function(value, text) {
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            const newIndex = items.length;
            const dropdownItem = Q('<div>')
                .addClass(Form.dropdownStyles['form_dropdown_item'])
                .attr('data-value', value)
                .text(text);
            dropdownItem.on('click', function(e) {
                e.stopPropagation();
                if (!dropdownItem.hasClass(Form.dropdownStyles['disabled'])) {
                    selectItem(newIndex);
                }
            });
            listContainer.append(dropdownItem);
            return newIndex;
        },
        remove: function(index) {
            if (index !== undefined) {
                const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
                const items = found ? found.nodes : [];
                if (index >= 0 && index < items.length) {
                    Q(items[index]).remove();
                    if (index === selectedIndex) {
                        selectedValue = null;
                        selectedText = '';
                        selectedIndex = -1;
                        label.text('Select an option');
                    }
                }
                return this;
            } else {
                container.remove();
                return null;
            }
        },
        getCount: function() {
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            return items.length;
        }
    };
    for (const key in dropdownAPI) {
        if (dropdownAPI.hasOwnProperty(key)) {
            container[key] = dropdownAPI[key];
        }
    }
    this.elements.push(container);
    return container;
};
