Form.prototype.Tags = function(value = '', placeholder = '', options = {}) {
    const defaultOptions = {
        separator: ',',
        maxTags: null,
        minChars: 1
    };
    options = Object.assign({}, defaultOptions, options);
    if (!Form.tagsClassesInitialized) {
        Form.tagsClasses = Q.style('', `
            .form_tags_container {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                width: 100%;
                min-height: 36px;
                padding: 3px;
                outline: var(--form-default-outline);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                cursor: text;
            }
            .form_tags_container:focus-within {
                border-color: var(--form-default-outline-focus);
                outline: none;
            }
            .form_tag {
            position:relative;
            overflow: hidden;
                display: inline-flex;
                align-items: center;
                padding: 0 30px 0 5px;
                background: var(--form-default-background);
                color: var(--form-default-text-color);
                border-radius: var(--form-default-border-radius);
                font-size: var(--form-default-font-size);
                font-family: var(--form-default-font-family);
                user-select: none;
            }
            .form_tag_editable {
                background-color: var(--form-default-background-hover);
            }
            .form_tag_remove {
                display: flex;
                position: absolute;
                right: 0;
                cursor: pointer;
                width: 20px;
                height: 100%;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }
            .form_tag_input {
                flex-grow: 1;
                min-width: 60px;
                border: none;
                outline: none;
                padding: 5px;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                background: transparent;
                color: var(--form-default-text-color);
            }
            .form_tag.dragging {
                opacity: 0.2;
            }
            .form_tag[draggable=true] {
                cursor: move;
            }
        `, null, {
            'form_tags_container': 'form_tags_container',
            'form_tag': 'form_tag',
            'form_tag_editable': 'form_tag_editable',
            'form_tag_remove': 'form_tag_remove',
            'form_tag_input': 'form_tag_input'
        });
        Form.tagsClassesInitialized = true;
    }
    const container = Q(`<div class="${Form.tagsClasses.form_tags_container}"></div>`);
    const input = Q(`<input class="${Form.tagsClasses.form_tag_input}" placeholder="${placeholder}" type="text">`);
    const state = {
        tags: [],
        draggedTag: null,
        currentEditTag: null
    };
    container.append(input);
    if (value && typeof value === 'string' && value.trim() !== '') {
        const initialTags = value.split(options.separator)
                               .map(tag => tag.trim())
                               .filter(Boolean);
        initialTags.forEach(tag => addTag(tag));
    }
    function addTag(text) {
        if (!text || text.length < options.minChars) return;
        if (options.maxTags !== null && state.tags.length >= options.maxTags) return;
        if (state.tags.includes(text)) return;
        const tag = Q(`<div class="${Form.tagsClasses.form_tag}" draggable="true"></div>`);
        const tagText = Q(`<span>${text}</span>`);
        const removeBtn = Q(`<span class="${Form.tagsClasses.form_tag_remove}">×</span>`);
        tag.append(tagText, removeBtn);
        state.tags.push(text);
        input.before(tag);
        setupDragAndDrop(tag);
        tag.on('click', function(e) {
            if (e.target.classList.contains(Form.tagsClasses.form_tag_remove.split(' ')[0])) return;
            tag.html('');
            tag.addClass(Form.tagsClasses.form_tag_editable);
            const editInput = Q(`<input type="text" value="${text}" style="border:none; background:transparent; color:inherit; outline:none; width:auto;">`);
            tag.append(editInput);
            editInput.focus();
            state.currentEditTag = { tag, originalText: text };
            editInput.on('blur', function() {
                finishEditing(editInput.val());
            });
            editInput.on('keydown', function(e) {
                if (e.key === 'Enter') {
                    finishEditing(editInput.val());
                    e.preventDefault();
                } else if (e.key === 'Escape') {
                    finishEditing(text); 
                    e.preventDefault();
                }
            });
        });
        removeBtn.on('click', function() {
            removeTag(tag, text);
        });
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.tags.join(options.separator));
        }
    }
    function finishEditing(newText) {
        if (!state.currentEditTag) return;
        const { tag, originalText } = state.currentEditTag;
        const index = state.tags.indexOf(originalText);
        if (index !== -1) {
            state.tags.splice(index, 1);
        }
        if (newText && newText.trim() && newText.length >= options.minChars) {
            tag.removeClass(Form.tagsClasses.form_tag_editable);
            tag.html(`<span>${newText}</span><span class="${Form.tagsClasses.form_tag_remove}">×</span>`);
            tag.find(`.${Form.tagsClasses.form_tag_remove.split(' ')[0]}`).on('click', function() {
                removeTag(tag, newText);
            });
            state.tags.push(newText);
        } else {
            tag.remove();
        }
        state.currentEditTag = null;
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.tags.join(options.separator));
        }
    }
    function removeTag(tagElement, text) {
        tagElement.remove();
        const index = state.tags.indexOf(text);
        if (index !== -1) {
            state.tags.splice(index, 1);
        }
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.tags.join(options.separator));
        }
    }
    function setupDragAndDrop(tag) {
        tag.on('dragstart', function(e) {
            state.draggedTag = tag;
            tag.addClass('dragging');
            if (e.dataTransfer) {
                e.dataTransfer.setData('text/plain', '');
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        tag.on('dragend', function() {
            state.draggedTag = null;
            tag.removeClass('dragging');
        });
        tag.on('dragover', function(e) {
            if (e.preventDefault) {
                e.preventDefault(); 
            }
            return false;
        });
        tag.on('dragenter', function(e) {
            e.preventDefault();
        });
        tag.on('drop', function(e) {
            e.stopPropagation();
            if (!state.draggedTag || state.draggedTag === tag) {
                return;
            }
            const allTags = Array.from(container.children()).filter(
                el => el.classList.contains(Form.tagsClasses.form_tag.split(' ')[0])
            );
            const fromIndex = allTags.indexOf(state.draggedTag);
            const toIndex = allTags.indexOf(tag);
            if (fromIndex < toIndex) {
                tag.after(state.draggedTag);
            } else {
                tag.before(state.draggedTag);
            }
            const movedTag = state.tags.splice(fromIndex, 1)[0];
            state.tags.splice(toIndex, 0, movedTag);
            if (typeof container.changeCallback === 'function') {
                container.changeCallback(state.tags.join(options.separator));
            }
            return false;
        });
    }
    container.on('click', function(e) {
        if (e.target === container.element) {
            input.focus();
        }
    });
    input.on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',' || e.key === ';' || (options.separator === ' ' && e.key === ' ')) {
            const value = input.val().trim();
            if (value) {
                addTag(value);
                input.val('');
                e.preventDefault();
            }
        }
        else if (e.key === 'Backspace' && input.val() === '' && state.tags.length > 0) {
            const tagElements = container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
            if (tagElements.length > 0) {
                const lastTag = Q(tagElements[tagElements.length - 1]);
                lastTag.click(); 
            }
        }
    });
    input.on('paste', function(e) {
        let pastedText;
        if (window.clipboardData && window.clipboardData.getData) {
            pastedText = window.clipboardData.getData('Text');
        } else if (e.clipboardData && e.clipboardData.getData) {
            pastedText = e.clipboardData.getData('text/plain');
        }
        if (pastedText) {
            e.preventDefault();
            const tags = pastedText.split(options.separator).map(tag => tag.trim()).filter(Boolean);
            tags.forEach(tag => addTag(tag));
            input.val('');
        }
    });
    input.on('blur', function() {
        const inputValue = input.val();
        const value = inputValue ? inputValue.trim() : '';
        if (value) {
            addTag(value);
            input.val('');
        }
    });
    container.val = function(value) {
        if (value === undefined) {
            return state.tags.join(options.separator);
        }
        if (value === '') {
            if (container.nodes && container.nodes.length > 0) {
                const tagElements = container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
                for (let i = 0; i < tagElements.length; i++) {
                    if (tagElements[i].parentNode) {
                        tagElements[i].parentNode.removeChild(tagElements[i]);
                    }
                }
            }
            state.tags = [];
        } else {
            if (container.nodes && container.nodes.length > 0) {
                const tagElements = container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
                for (let i = 0; i < tagElements.length; i++) {
                    if (tagElements[i].parentNode) {
                        tagElements[i].parentNode.removeChild(tagElements[i]);
                    }
                }
            }
            state.tags = [];
            const newTags = value.split(options.separator).map(tag => tag.trim()).filter(Boolean);
            newTags.forEach(tag => addTag(tag));
        }
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.tags.join(options.separator));
        }
        return container;
    };
    container.placeholder = function(text) {
        input.attr('placeholder', text);
        return container;
    };
    container.disabled = function(state) {
        input.prop('disabled', state);
        container.css('pointer-events', state ? 'none' : 'auto');
        if (state) {
            container.addClass(Form.classes.q_form_disabled);
        } else {
            container.removeClass(Form.classes.q_form_disabled);
        }
        return container;
    };
    container.setSeparator = function(separator) {
        options.separator = separator;
        return container;
    };
    container.reset = function() {
        return container.val('');
    };
    container.change = function(callback) {
        container.changeCallback = callback;
        return container;
    };
    this.elements.push(container);
    return container;
};
