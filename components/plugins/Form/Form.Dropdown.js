Form.prototype.Dropdown = function(options = {}) {
    if (!Form.dropdownStyles) {
        Form.dropdownStyles = Q.style('', `
            .q_form_dropdown {
                position: relative;
                width: 100%;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                cursor: pointer;
                user-select: none;
                border: 1px solid var(--form-default-input-border-color);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                color: var(--form-default-input-text-color);
            }
            .q_form_dropdown.disabled {
                opacity: 0.6;
                cursor: not-allowed;
                pointer-events: none;
            }
            .q_form_dropdown_selected {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--form-default-padding);
                line-height: normal;
                cursor: pointer;
                user-select: none;
                width: 100%;
            }
            .q_form_dropdown_items {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 3px;
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
                background-color: var(--form-default-input-background-color);
                border: 1px solid var(--form-default-input-border-color);
                border-radius: var(--form-default-border-radius);
                box-shadow: var(--form-default-dropdown-shadow);
                display: none;
                color: var(--form-default-input-text-color);
            }
            .q_form_dropdown_item {
                padding: var(--form-default-padding);
                cursor: pointer;
            }
            .q_form_dropdown_item:hover {
                background-color: var(--form-default-selected-background-color);
                color: var(--form-default-selected-text-color);
            }
            .q_form_dropdown_item.selected {
                background-color: var(--form-default-selected-background-color);
                color: var(--form-default-selected-text-color);
                font-weight: 500;
            }
            .q_form_dropdown_items {
                display: none;
            }
            .q_form_dropdown_arrow {
                transition: transform 0.2s;
            }
            .q_form_dropdown.open .q_form_dropdown_arrow {
                transform: rotate(180deg);
            }
            .q_form_dropdown.open .q_form_dropdown_items {
                display: block;
                position: absolute;
                width: 100%;
                z-index: 1000;
                overflow-y: auto;
                top: 100%;
            }
        `, null, {
            'q_form_dropdown': 'q_form_dropdown',
            'q_form_dropdown_selected': 'q_form_dropdown_selected', 
            'q_form_dropdown_items': 'q_form_dropdown_items',
            'q_form_dropdown_item': 'q_form_dropdown_item',
            'q_form_dropdown_arrow': 'q_form_dropdown_arrow'
        });
    }

    const mapping = Form.dropdownStyles;

    const container = Q('<div>').addClass(Form.classes['q_form']).addClass(mapping['q_form_dropdown']);
    const header = Q('<div>').addClass(mapping['q_form_dropdown_selected']);
    const label = Q('<div>').text('Select an option').addClass('selected-text');
    const arrow = Q('<div>').addClass(mapping['q_form_dropdown_arrow']).html('&#9662;');
    header.append(label, arrow);
    const listContainer = Q('<div>').addClass(mapping['q_form_dropdown_items']);
    // Add scrollbar design from Form.classes if available
        listContainer.addClass(Form.classes['scrollbar']);
    container.append(header);

    if (options['max-height']) {
        listContainer.css('maxHeight', options['max-height'] + 'px');
    }

    let selectedValue = null;
    let selectedText = '';
    let selectedIndex = -1;
    let isDisabled = options.disabled || false;
    let changeCallback = options.change || null;
    let documentClickHandler = null;

    if (isDisabled) { container.addClass('disabled'); }

    header.on('click', function(e) {
        e.stopPropagation();
        if (isDisabled) return;
        toggleDropdown();
    });

    function toggleDropdown(force) {
        const isOpen = (typeof force !== 'undefined') ? force : !container.hasClass('open');
        if (isOpen) {
            container.addClass('open');
            container.append(listContainer);
            if (!documentClickHandler) {
                documentClickHandler = function(e) {
                    if (!container.nodes[0].contains(e.target)) {
                        container.removeClass('open');
                        listContainer.remove();
                    }
                };
                Q(document).on('click', documentClickHandler);
            }
        } else {
            container.removeClass('open');
            listContainer.remove();
        }
    }

    function selectItem(index) {
        const found = listContainer.find('.' + mapping['q_form_dropdown_item']);
        const items = found ? found.nodes : [];
        if (index < 0 || index >= items.length) return;
        
        const item = Q(items[index]);
        if (item.hasClass('disabled')) return;
        
        if (found) found.removeClass('selected');
        
        item.addClass('selected');
        selectedValue = item.attr('data-value');
        selectedText = item.text();
        selectedIndex = index;
        label.text(selectedText);
        toggleDropdown(false);
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
                .addClass(mapping['q_form_dropdown_item'])
                .attr('data-value', item.value)
                .text(item.text);
            if (item.disabled) { dropdownItem.addClass('disabled'); }
            if (item.default) { defaultIndex = index; }
            dropdownItem.on('click', function(e) {
                e.stopPropagation();
                if (!dropdownItem.hasClass('disabled')) {
                    selectItem(index);
                }
            });
            listContainer.append(dropdownItem);
        });
        if (defaultIndex >= 0) {
            selectItem(defaultIndex);
        } else {
            selectedValue = null;
            selectedText = '';
            selectedIndex = -1;
            label.text('Select an option');
        }
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
            if (isDisabled) { container.addClass('disabled'); }
            else { container.removeClass('disabled'); }
            return this;
        },
        select: function(index) {
            selectItem(index);
            return this;
        },
        index: function(index) {
            const found = listContainer.find('.' + mapping['q_form_dropdown_item']);
            const items = found ? found.nodes : [];
            if (index >= 0 && index < items.length) {
                const item = Q(items[index]);
                return { value: item.attr('data-value'), text: item.text() };
            }
            return null;
        },
        disable: function(indexes) {
            if (!Array.isArray(indexes)) return this;
            const found = listContainer.find('.' + mapping['q_form_dropdown_item']);
            const items = found ? found.nodes : [];
            indexes.forEach(idx => {
                if (idx >= 0 && idx < items.length) {
                    Q(items[idx]).addClass('disabled');
                }
            });
            return this;
        },
        enable: function(indexes) {
            if (!Array.isArray(indexes)) return this;
            const found = listContainer.find('.' + mapping['q_form_dropdown_item']);
            const items = found ? found.nodes : [];
            indexes.forEach(idx => {
                if (idx >= 0 && idx < items.length) {
                    Q(items[idx]).removeClass('disabled');
                }
            });
            return this;
        },
        text: function(index, newText) {
            const found = listContainer.find('.' + mapping['q_form_dropdown_item']);
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
            const found = listContainer.find('.' + mapping['q_form_dropdown_item']);
            const items = found ? found.nodes : [];
            const newIndex = items.length;
            const dropdownItem = Q('<div>')
                .addClass(mapping['q_form_dropdown_item'])
                .attr('data-value', value)
                .text(text);
            dropdownItem.on('click', function(e) {
                e.stopPropagation();
                if (!dropdownItem.hasClass('disabled')) {
                    selectItem(newIndex);
                }
            });
            listContainer.append(dropdownItem);
            return newIndex;
        },
        remove: function(index) {
            if (index !== undefined) {
                const found = listContainer.find('.' + mapping['q_form_dropdown_item']);
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
                if (documentClickHandler) {
                    Q(document).off('click', documentClickHandler);
                    documentClickHandler = null;
                }
                container.remove();
                return null;
            }
        },
        // New method to get the count of items
        getCount: function() {
            const found = listContainer.find('.' + mapping['q_form_dropdown_item']);
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
