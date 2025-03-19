Q.Form.Tag = function (options = {}) {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    const Icon = Form.Icon;
    
    // Define Tag-specific styles
    const classes = Object.assign({}, sharedClasses, Q.style('', `
        .tag_container {
            display: flex;
            flex-wrap: wrap;
        } 

        .tag_tag {
            display: flex;
            align-items: center;
            border: 1px solid #333;
            color: #fff;
            overflow: hidden;
            margin: 2px;
            border-radius: 5px;
        }

        .tag_rating {
            display: flex;
            background-color: #333;
            padding: 2px 5px;
            align-items: center;
        }

        .tag_icon {
            width: 10px;
            height: 10px;
        }

        .tag_icon_small {
            width: 5px;
            height: 5px;
        }

        .tag_name {
            padding: 2px 8px;
        }

        .tag_value {
            padding: 0 5px;
            user-select: none;   
        }

        .tag_close {
            cursor: pointer;
            background-color: #333;
            height: auto;
            width: 20px;
        }

        .tag_input {
            width: content;
            border: 0;
            margin: 0;
            background-color: transparent;
            color: #fff;
        }

        .tag_name[contenteditable="true"] {
            cursor: text;
        }

        .tag_name[contenteditable="true"]:focus {
            outline: 0;
        }
    `, null, {
        'tag_container': 'tag_container',
        'tag_tag': 'tag_tag',
        'tag_rating': 'tag_rating',
        'tag_icon': 'tag_icon',
        'tag_icon_small': 'tag_icon_small',
        'tag_name': 'tag_name',
        'tag_value': 'tag_value',
        'tag_close': 'tag_close',
        'tag_input': 'tag_input',
        'tag_up': 'tag_up',
        'tag_down': 'tag_down'
    }));
    
    const defaultOptions = {
        min: 0,
        max: 10,
        step: 1,
        value: 0,
        digit: 3,
        flood: 500,
        disabled: false,
        removable: true,
        votes: true,
        readonly: false,
        placeholder: ''
    };

    // Merge defaultOptions with passed options using destructuring
    let { min, max, step, digit, votes, removable, flood } = { ...defaultOptions, ...options };

    if (step.toString().includes('.')) {
        digit = step.toString().split('.')[1].length;
    }

    let data = [];
    let changeCallback = null;
    const tagContainer = Q('<div>', { class: classes.tag_container });
    const input = Q('<input>', { class: classes.tag_input });
    const malformFix = Q('<input>', { class: classes.tag_input });
    let ID = Q.ID(5, '_');

    // Function to handle vote changes (common for both upvote and downvote)
    const changeTagValue = (tag, delta, currentValue) => {
        let newValue = tag.value + delta;
        newValue = Math.min(Math.max(newValue, min), max);
        tag.value = parseFloat(newValue.toFixed(digit));
        currentValue.text(tag.value);
        data = data.map(t => (t.tag === tag.tag ? { ...t, value: tag.value } : t));

        // Trigger the change callback with debounce (flood control)
        if (changeCallback) Q.Debounce(ID, flood, changeCallback);
    };

    const appendTags = tags => {
        tags.forEach(tag => {
            const tagElement = Q('<div>', { class: classes.tag_tag });
            let tagValue = Q('<div>', { class: classes.tag_name }).text(tag.tag);

            if (votes) {
                const tagRate = Q('<div>', { class: classes.tag_rating });
                const upvote = Q('<div>', { class: [classes.tag_icon, classes.tag_up] }).html(Icon('arrow-up'));
                const currentValue = Q('<div>', { class: classes.tag_value }).text(tag.value);
                const downvote = Q('<div>', { class: [classes.tag_icon, classes.tag_down] }).html(Icon('arrow-down'));

                tagRate.append(downvote, currentValue, upvote);
                tagElement.append(tagRate);

                upvote.on('click', () => changeTagValue(tag, step, currentValue));
                downvote.on('click', () => changeTagValue(tag, -step, currentValue));
            }

            if (!defaultOptions.readonly) {
                tagValue.attr('contenteditable', true);

                tagValue.on('input', function () {
                    malformFix.val(tagValue.text());
                    tagValue.text(malformFix.val());
                    tag.tag = malformFix.val();

                    // Trigger the change callback with debounce (flood control)
                    if (changeCallback) Q.Debounce(ID, flood, changeCallback);
                });
            }

            tagElement.append(tagValue);

            if (removable) {
                const close = Q('<div>', { class: [classes.tag_icon_small, classes.tag_close] }).html(Icon('window-close'));
                close.on('click', () => {
                    data = data.filter(t => t.tag !== tag.tag);
                    tagElement.remove();

                    // Trigger the change callback with debounce (flood control)
                    if (changeCallback) Q.Debounce(ID, flood, changeCallback);
                });
                tagElement.append(close);
            }

            tagContainer.append(tagElement);
        });
    };

    tagContainer.add = function (taglist) {
        tagContainer.empty();

        if (!Array.isArray(taglist)) {
            taglist = [taglist];
        }

        taglist = taglist.map(tag => (typeof tag === 'string' ? { tag, value: 0 } : tag));
        data = [...data, ...taglist];

        appendTags(data);
    };

    tagContainer.get = function () {
        return data;
    };

    // Method to set the change callback
    tagContainer.change = function (callback) {
        changeCallback = callback;
    };

    return tagContainer;
};
