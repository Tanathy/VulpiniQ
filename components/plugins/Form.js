// Name: Form
// Method: Plugin
// Desc: Form is a simple library for creating forms and windows in the browser. It provides a set of methods for creating form elements, windows, and other UI components.
// Type: Plugin
// Example: var containers = Q.Form()
// Dependencies: Style, addClass, removeClass, on, append, each, find, scrollTop, scrollLeft, hasClass, text, html, val, click, closest, empty, show, hide, css, attr, prop, remove, add
Q.Form = function (options = {}) {

    let Icon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' form_icon');
        return iconElement;
    };

    let classes = Q.style(`
           .form_icon {
               width: 100%;
               height: 100%;
               color: #fff;
               /* Default color */
               pointer-events: none;
           }

           .q_form {
               box-sizing: border-box;
               font-family: inherit;
               font-size: inherit;
               color: inherit;
               margin: 1px;
           }

           .q_form_disabled {
               opacity: 0.5;
           }

           .q_form_checkbox,
           .q_form_radio {
               display: flex;
               width: fit-content;
               align-items: center;
           }

           .q_form_checkbox .label:empty,
           .q_form_radio .label:empty {
               display: none;
           }

           .q_form_checkbox .label,
           .q_form_radio .label {
               padding-left: 5px;
               user-select: none;
           }

           .q_form_cb {
               position: relative;
               width: 20px;
               height: 20px;
               background-color: #555555;
           }

           .q_form_cb input[type="checkbox"] {
               opacity: 0;
               top: 0;
               left: 0;
               padding: 0;
               margin: 0;
               width: 100%;
               height: 100%;
               position: absolute;
           }

           .q_form_cb input[type="checkbox"]:checked+label:before {
               content: "";
               position: absolute;
               display: block;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               background-color: #1DA1F2;
           }

           .q_form_r {
               position: relative;
               width: 20px;
               height: 20px;
               background-color: #555555;
               border-radius: 50%;
               overflow: hidden;
           }

           .q_form_r input[type="radio"] {
               opacity: 0;
               top: 0;
               left: 0;
               padding: 0;
               margin: 0;
               width: 100%;
               height: 100%;
               position: absolute;
               border-radius: 50%;
           }

           .q_form_r input[type="radio"]:checked+label:before {
               content: "";
               position: absolute;
               display: block;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               background-color: #1DA1F2;
               border-radius: 50%;
           }

           .q_form_input {
               width: calc(100% - 2px);
               padding: 5px;
               outline: none;
               border: 0;
           }

           .q_form_input:focus,
           .q_form_textarea:focus {
               outline: 1px solid #1DA1F2;
           }

           .q_form_textarea {
               width: calc(100% - 2px);
               padding: 5px;
               outline: none;
               border: 0;
           }

           .q_window {
               position: fixed;
               background-color: #333;
               z-index: 1000;
               box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
               border: 1px solid rgba(255, 255, 255, 0.01);
               border-radius: 5px;
               overflow: hidden;
               display: flex;
               flex-direction: column;
           }

           .q_window_titlebar {
               user-select: none;
               display: flex;
               background-color: #222;
               width: 100%;
               flex-shrink: 0;
           }

           .q_window_buttons {
               display: flex;
           }

           .q_window_button {
               box-sizing: border-box;
               display: flex;
               justify-content: center;
               align-items: center;
               cursor: pointer;
               width: 30px;
               height: 30px;
               padding: 10px;
               background-color: rgba(255, 255, 255, 0.01);
               margin-left: 1px;
           }

           .q_window_button:hover {
               background-color: #424242;
           }

           .q_window_close:hover {
               background-color: #e81123;
           }

           .q_window_titletext {
               flex-grow: 1;
               color: #fff;
               align-content: center;
               white-space: nowrap;
               overflow: hidden;
               text-overflow: ellipsis;
               padding: 0 5px
           }

           .q_window_content {
               width: 100%;
               overflow-y: auto;
               flex: 1;
           }

           .q_slider_wrapper {
               position: relative;
               height: 20px;
               overflow: hidden;
               background-color: #333;
           }

           .q_slider_pos {
               position: absolute;
               top: 0;
               left: 0;
               width: 0;
               height: 100%;
               background-color: #1473e6;
           }

           .q_form_slider {
               width: 100%;
               opacity: 0;
               height: 100%;
               position: absolute;
           }


           .q_form_dropdown {
               user-select: none;
               position: relative;
               background-color: #333;
           }

           .q_form_dropdown_options {
               position: absolute;
               width: 100%;
               background-color: #333;
               z-index: 1;
           }

           .q_form_dropdown_option,
           .q_form_dropdown_selected {
               padding: 5px 0px;
           }

           .q_form_button {
               user-select: none;
               padding: 5px 10px;
               cursor: pointer;
           }

           .q_form_button:hover {
               background-color: #555;
           }

           .q_form_button:active {
               background-color: #777;
           }

           .q_form_file {
               user-select: none;
               position: relative;
               overflow: hidden;
           }

           .q_form_file input[type="file"] {
               position: absolute;
               width: 100%;
               height: 100%;
               opacity: 0;
           }

           .datepicker_wrapper {
               user-select: none;
               width: 100%;
               height: 100%;
               display: flex;
               flex-direction: column;
           }

           .datepicker_header {
               display: flex;
               align-items: center;
               color: #fff;
               justify-content: center;
           }

           .datepicker_header div {
               padding: 15px 5px;
           }

           .datepicker_weekdays {
               display: grid;
               grid-template-columns: repeat(7, 1fr);
           }

           .datepicker_weekdays div {
               display: flex;
               align-items: center;
               justify-content: center;
           }

           .datepicker_days {
               display: grid;
               grid-template-columns: repeat(7, 1fr);
               flex: 1;
           }

           .prev_month,
           .next_month {
               opacity: 0.5;
           }

           .datepicker_body {
               display: flex;
               flex-direction: column;
               flex: 1;
           }

           .days {
               cursor: default;
               display: flex;
               align-items: center;
               justify-content: center;
           }

           .day_selected {
               background-color: #1473e6;
               color: #fff;
           }

           .datepicker_footer {
               display: flex;
               justify-content: flex-end;
           }


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
    margin:0;
    background-color: transparent;
    color: #fff;
}

.tag_name[contenteditable="true"] {
    cursor: text;
}

.tag_name[contenteditable="true"]:focus {
    outline: 0;
}

    `, {
        'q_form': 'q_form',
        'q_form_disabled': 'q_form_disabled',
        'q_form_checkbox': 'q_form_checkbox',
        'q_form_radio': 'q_form_radio',
        'q_form_cb': 'q_form_cb',
        'q_form_r': 'q_form_r',
        'q_form_input': 'q_form_input',
        'q_form_textarea': 'q_form_textarea',
        'q_window': 'q_window',
        'q_window_titlebar': 'q_window_titlebar',
        'q_window_buttons': 'q_window_buttons',
        'q_window_button': 'q_window_button',
        'q_window_titletext': 'q_window_titletext',
        'q_window_content': 'q_window_content',
        'q_slider_wrapper': 'q_slider_wrapper',
        'q_slider_pos': 'q_slider_pos',
        'q_form_slider': 'q_form_slider',
        'q_form_dropdown': 'q_form_dropdown',
        'q_form_dropdown_options': 'q_form_dropdown_options',
        'q_form_dropdown_option': 'q_form_dropdown_option',
        'q_form_dropdown_selected': 'q_form_dropdown_selected',
        'q_form_button': 'q_form_button',
        'q_form_progress_bar': 'q_form_progress_bar',
        'q_form_file': 'q_form_file',
        'q_form_progress': 'q_form_progress',
        'q_form_dropdown_active': 'q_form_dropdown_active',
        'q_window_close': 'q_window_close',
        'q_window_minimize': 'q_window_minimize',
        'q_window_maximize': 'q_window_maximize',

        'tag_name': 'tag_name',
        'tag_input': 'tag_input',
        'tag_close': 'tag_close',
        'tag_value': 'tag_value',
        'tag_icon_small': 'tag_icon_small',
        'tag_rating': 'tag_rating',
        'tag_container': 'tag_container',
        'tag_tag': 'tag_tag',
        'tag_icon': 'tag_icon',
        'tag_up': 'tag_up',
        'tag_down': 'tag_down',
    });

    return {


        Tag: function (options = {}) {
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
        
            // Debounce function to control the rate of triggering the callback
        
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
        },



        // NOT FINISHED - Datepicker is work in progress yet
        DatePicker: function (value = '', locale = window.navigator.language, range = false) {

            let getFirstDayOfWeek = () => {
                // Create a date that is the first day of a week in the locale
                let startDate = new Date();
                let dayOfWeek = startDate.getDay();
                startDate.setDate(startDate.getDate() - dayOfWeek);

                // Return the day of the week as the first day of the week in locale (0 = Sunday, 1 = Monday, etc.)
                return startDate.toLocaleDateString(locale, { weekday: 'short' });
            };

            let daysLocale = (short = true) => {
                let days = [];
                let baseDate = new Date(2021, 0, 4);
                const options = { weekday: short ? 'short' : 'long' };

                let firstDayOfWeek = getFirstDayOfWeek();

                // Shift the baseDate to the locale's first day of the week
                while (baseDate.toLocaleDateString(locale, options) !== firstDayOfWeek) {
                    baseDate.setDate(baseDate.getDate() - 1);
                }

                for (let i = 0; i < 7; i++) {
                    let date = new Date(baseDate);
                    date.setDate(date.getDate() + i);
                    days.push(date.toLocaleDateString(locale, options));
                }
                return days;
            };

            let monthsLocale = (short = true) => {
                let months = [];
                for (let i = 0; i < 12; i++) {
                    let date = new Date(2021, i, 1);
                    months.push(date.toLocaleDateString(locale, { month: short ? 'short' : 'long' }));
                }
                return months;
            };

            let date = value ? new Date(value) : new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let daysInMonth = new Date(year, month, 0).getDate();
            let firstDay = new Date(year, month - 1, 1).getDay();
            let lastDay = new Date(year, month - 1, daysInMonth).getDay();

            // Get the localized days of the week starting from the locale's first day of the week
            let days = daysLocale(true);
            let dayNames = days.map((dayName, i) => {
                let dayElement = Q('<div>');
                dayElement.text(dayName);
                return dayElement;
            });

            let wrapper = Q('<div class="datepicker_wrapper">');
            let header = Q('<div class="datepicker_header">');
            let body = Q('<div class="datepicker_body">');
            let footer = Q('<div class="datepicker_footer">');
            let weekdays = Q('<div class="datepicker_weekdays">');
            let days_wrapper = Q('<div class="datepicker_days">');
            let dateInput = Q('<input type="date">');
            let button_ok = this.Button('OK');
            let button_today = this.Button('Today');
            footer.append(button_today, button_ok);
            body.append(weekdays, days_wrapper);
            wrapper.append(header, body, footer);

            // let container_day = Q('<div>');
            // let container_weekday = Q('<div>');
            let container_months = Q('<div>');
            let container_years = Q('<div>');

            header.append(container_months, container_years);

            if (wrapper.inside(classes.q_window)) {
                let button_cancel = this.Button('Cancel');
                footer.append(button_cancel);
                button_cancel.click(function () {
                    wrapper.closest('.' + classes.q_window).hide(200);
                });
            }

            container_months.on('click', function () {



            });

            button_today.click(function () {
                date = new Date();
                day = date.getDate();
                month = date.getMonth() + 1;
                year = date.getFullYear();
                daysInMonth = new Date(year, month, 0).getDate();
                firstDay = new Date(year, month - 1, 1).getDay();
                lastDay = new Date(year, month - 1, daysInMonth).getDay();
                populateDays(month, year, day);
                populateHeader(month, year, day);
            });

            const populateHeader = function (month, year, day) {
                // let fullDay = date.toLocaleDateString(locale, { weekday: 'long' });
                // let days = daysLocale(true);
                let months = monthsLocale(false);

                // container_day.text(fullDay); // Display full day name in the header
                // container_weekday.text(day);
                container_months.text(months[month - 1]);
                container_years.text(year);
            }

            let populateDays = function (month, year, day) {
                days_wrapper.empty();

                // Calculate the number of days in the previous month
                let daysInPrevMonth = new Date(year, month - 1, 0).getDate();
                let prevMonthDays = [];
                for (let i = daysInPrevMonth - firstDay + 1; i <= daysInPrevMonth; i++) {
                    let dayElement = Q('<div>');
                    dayElement.text(i);
                    dayElement.addClass('days prev_month');
                    prevMonthDays.push(dayElement);
                }

                let currentMonthDays = [];
                for (let i = 1; i <= daysInMonth; i++) {
                    let dayElement = Q('<div>');
                    dayElement.text(i);
                    dayElement.addClass('days current_month');
                    if (i === day) {
                        dayElement.addClass('day_selected');
                    }
                    currentMonthDays.push(dayElement);
                }

                let nextMonthDays = [];
                for (let i = 1; i <= 7 - lastDay; i++) {
                    let dayElement = Q('<div>');
                    dayElement.text(i);
                    dayElement.addClass('days next_month');
                    nextMonthDays.push(dayElement);
                }

                days_wrapper.append(...prevMonthDays, ...currentMonthDays, ...nextMonthDays);
            };

            weekdays.append(...dayNames);

            populateDays(month, year, day);

            populateHeader(month, year, day);

            days_wrapper.on('click', function (e) {
                let target = Q(e.target);
                if (target.hasClass('days')) {
                    let day = parseInt(target.text());

                    if (target.hasClass('prev_month')) {
                        if (month === 1) {
                            month = 12;
                            year--;
                        } else {
                            month--;
                        }
                    } else if (target.hasClass('next_month')) {
                        if (month === 12) {
                            month = 1;
                            year++;
                        } else {
                            month++;
                        }
                    }

                    date = new Date(year, month - 1, day);
                    populateDays(month, year, day);
                    populateHeader(month, year, day);
                }
            });

            return wrapper;
        },

        // NOT FINISHED - Progressbar is work in progress yet
        ProgressBar: function (value = 0, min = 0, max = 100, autoKill = 0) {
            let timer = null;
            const progress = Q('<div class="' + classes.q_form + ' ' + classes.q_form_progress + '">');
            const bar = Q('<div class="' + classes.q_form_progress_bar + '">');
            progress.append(bar);

            function clearAutoKillTimer() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            }

            function setAutoKillTimer() {
                if (autoKill > 0) {
                    clearAutoKillTimer();
                    timer = setTimeout(() => {
                        progress.hide();
                    }, autoKill);
                }
            }

            progress.value = function (value) {
                const range = max - min;
                const newWidth = ((value - min) / range) * 100 + '%';
                if (bar.css('width') !== newWidth) {
                    bar.css({ width: newWidth });
                }
                progress.show();
                clearAutoKillTimer();
                setAutoKillTimer();
            };

            progress.min = function (value) {
                min = value;
                progress.value(value);
            };

            progress.max = function (value) {
                max = value;
                progress.value(value);
            };

            progress.autoKill = function (delay) {
                autoKill = delay;
                setAutoKillTimer();
            };

            progress.value(value);

            return progress;
        },

        // NOT FINISHED - Checkbox is work in progress yet
        Button: function (text = '') {
            const button = Q(`<div class="${classes.q_form} ${classes.q_form_button}">${text}</div>`);

            button.click = function (callback) {
                button.on('click', callback);
            };

            button.disabled = function (state) {
                if (state) {
                    button.addClass(classes.q_form_disabled);
                }
                else {
                    button.removeClass(classes.q_form_disabled);
                }
            };

            button.text = function (text) {
                button.text(text);
            };

            button.remove = function () {
                button.remove();
            };

            return button;
        },

        // NOT FINISHED - Checkbox is work in progress yet
        File: function (text = '', accept = '*', multiple = false) {
            const container = Q('<div class="' + classes.q_form + ' ' + classes.q_form_file + ' ' + classes.q_form_button + '">');
            const input = Q(`<input type="file" accept="${accept}" ${multiple ? 'multiple' : ''}>`);
            const label = Q(`<div>${text}</div>`);
            container.append(input, label);

            input.disabled = function (state) {
                input.prop('disabled', state);
                if (state) {
                    container.addClass(classes.q_form_disabled);
                } else {
                    container.removeClass(classes.q_form_disabled);
                }
            };

            container.change = function (callback) {
                input.on('change', function () {
                    callback(this.files);
                });
            };

            container.image = function (processText = '', size, callback) {
                input.on('change', function () {
                    label.text(processText);
                    let files = this.files;
                    let fileReaders = [];
                    let images = [];

                    for (let i = 0; i < files.length; i++) {
                        if (!files[i].type.startsWith('image/')) {
                            continue;
                        }

                        fileReaders[i] = new FileReader();
                        fileReaders[i].onload = function (e) {
                            let img = new Image();
                            img.onload = function () {
                                if (size !== 'original') {
                                    let canvas = document.createElement('canvas');
                                    let ctx = canvas.getContext('2d');
                                    let width = size;
                                    let height = (img.height / img.width) * width;
                                    canvas.width = width;
                                    canvas.height = height;
                                    ctx.drawImage(img, 0, 0, width, height);
                                    images.push(canvas.toDataURL('image/png'));
                                } else {
                                    images.push(e.target.result);
                                }
                                if (images.length === files.length) {
                                    label.text(text);
                                    callback(images);
                                }
                            };
                            img.src = e.target.result;
                        };
                        fileReaders[i].readAsDataURL(files[i]);
                    }
                });
            };

            return container;
        },


        DropDown: function (data) {
            let wrapper = Q('<div class="' + classes.q_form + ' ' + classes.q_form_dropdown + '">');
            let selected = Q('<div class="' + classes.q_form_dropdown_selected + '">');
            let options = Q('<div class="' + classes.q_form_dropdown_options + '">');

            options.hide();
            wrapper.append(selected, options);


            let valueMap = new Map();

            data.forEach((item, index) => {
                let option = Q('<div class="' + classes.q_form_dropdown_option + '">');
                option.html(item.content);
                if (item.disabled) {
                    option.addClass(classes.q_form_disabled);
                }
                options.append(option);
                valueMap.set(option, item.value);
            });


            selected.html(data[0].content);
            let selectedValue = data[0].value;

            function deselect() {
                options.hide();
                document.removeEventListener('click', deselect);
            }
            options.find('.' + classes.q_form_dropdown_option).first().addClass(classes.q_form_dropdown_active);

            options.on('click', function (e) {
                let target = Q(e.target);
                if (target.hasClass(classes.q_form_dropdown_option) && !target.hasClass(classes.q_form_disabled)) {
                    selected.html(target.html());
                    selectedValue = valueMap.get(target);
                    deselect();
                    options.find('.' + classes.q_form_dropdown_option).removeClass(classes.q_form_dropdown_active);
                    target.addClass(classes.q_form_dropdown_active);
                }
            });

            selected.on('click', function (e) {
                e.stopPropagation();
                options.toggle();
                if (options.is(':visible')) {
                    document.addEventListener('click', deselect);
                } else {
                    document.removeEventListener('click', deselect);
                }
            });

            wrapper.change = function (callback) {
                options.on('click', function (e) {
                    let target = Q(e.target);
                    if (target.hasClass(classes.q_form_dropdown_option) && !target.hasClass(classes.q_form_disabled)) {
                        callback(valueMap.get(target));
                    }
                });
            };

            wrapper.select = function (value) {
                options.find('.' + classes.q_form_dropdown_option).each(function () {
                    let option = Q(this);
                    if (valueMap.get(option) === value) {
                        selected.html(option.html());
                        selectedValue = value;
                        deselect();
                        options.find('.' + classes.q_form_dropdown_option).removeClass(classes.q_form_dropdown_active);
                        option.addClass(classes.q_form_dropdown_active);
                    }
                });
            };

            wrapper.disabled = function (value, state) {
                options.find('.' + classes.q_form_dropdown_option).each(function () {
                    let option = Q(this);
                    if (valueMap.get(option) === value) {
                        option.prop('disabled', state);
                        if (state) {
                            option.addClass(classes.q_form_disabled);
                        } else {
                            option.removeClass(classes.q_form_disabled);
                        }
                    }
                });
            };

            wrapper.remove = function (value) {
                options.find('.' + classes.q_form_dropdown_option).each(function () {
                    let option = Q(this);
                    if (valueMap.get(option) === value) {
                        option.remove();
                        valueMap.delete(option);
                    }
                });
            };

            wrapper.value = function () {
                return selectedValue;
            };

            return wrapper;
        },


        Slider: function (min = 0, max = 100, value = 50) {
            const slider = Q('<input type="range" class="' + classes.q_form_slider + '">');
            slider.attr('min', min);
            slider.attr('max', max);
            slider.attr('value', value);

            let slider_wrapper = Q('<div class="' + classes.q_form + ' ' + classes.q_slider_wrapper + '">');
            let slider_value = Q('<div class="' + classes.q_slider_pos + '">');
            slider_wrapper.append(slider_value, slider);

            const slider_width = () => {
                let percent = (slider.val() - slider.attr('min')) / (slider.attr('max') - slider.attr('min')) * 100;
                slider_value.css({
                    width: percent + '%'
                });
            };

            slider.on('input', function () {
                slider_width();
            });

            slider_width();

            slider_wrapper.change = function (callback) {
                slider.on('input', function () {
                    callback(this.value);
                });
            };

            slider_wrapper.value = function (value) {
                if (value !== undefined) {
                    slider.val(value);
                    slider.trigger('input');
                }
                return slider.val();
            };

            slider_wrapper.disabled = function (state) {
                slider.prop('disabled', state);
                if (state) {
                    slider_wrapper.addClass(classes.q_form_disabled);
                } else {
                    slider_wrapper.removeClass(classes.q_form_disabled);
                }

            };
            slider_wrapper.min = function (value) {
                if (value !== undefined) {
                    slider.attr('min', value);
                    slider.trigger('input');
                }
                return slider.attr('min');
            };
            slider_wrapper.max = function (value) {
                if (value !== undefined) {
                    slider.attr('max', value);
                    slider.trigger('input');
                }
                return slider.attr('max');
            };
            slider_wrapper.remove = function () {
                slider_wrapper.remove();
            };
            return slider_wrapper;
        },

        // Window: Need solution for resize
        Window: function (title = '', data, width = 300, height = 300, x = 100, y = 10) {

            let dimensions = { width, height, x, y };
            let minimized = false;
            let maximized = false;
            let animation_speed = 200;

            let window_wrapper = Q('<div class="' + classes.q_window + '">');
            let titlebar = Q('<div class="' + classes.q_window_titlebar + '">');
            let titletext = Q('<div class="' + classes.q_window_titletext + '">');
            let uniqueButtons = Q('<div class="' + classes.q_window_unique_buttons + '">');
            let default_buttons = Q('<div class="' + classes.q_window_buttons + '">');
            let content = Q('<div class="' + classes.q_window_content + '">');
            let close = Q('<div class="' + classes.q_window_button + ' ' + classes.q_window_close + '">');
            let minimize = Q('<div class="' + classes.q_window_button + ' ' + classes.q_window_minimize + '">');
            let maximize = Q('<div class="' + classes.q_window_button + ' ' + classes.q_window_maximize + '">');

            close.append(Icon('window-close'));
            minimize.html(Icon('window-minimize'));
            maximize.html(Icon('window-full'));

            content.append(data);
            titletext.text(title);
            titletext.attr('title', title);

            titlebar.append(titletext, uniqueButtons, default_buttons);
            default_buttons.append(minimize, maximize, close);
            window_wrapper.append(titlebar, content);



            dimensions.width = dimensions.width > window_wrapper.parent().width() ? window_wrapper.parent().width() : dimensions.width;
            dimensions.height = dimensions.height > window_wrapper.parent().height() ? window_wrapper.parent().height() : dimensions.height;
            dimensions.x = dimensions.x + dimensions.width > window_wrapper.parent().width() ? window_wrapper.parent().width() - dimensions.width : dimensions.x;
            dimensions.y = dimensions.y + dimensions.height > window_wrapper.parent().height() ? window_wrapper.parent().height() - dimensions.height : dimensions.y;

            window_wrapper.css({
                width: dimensions.width + 'px',
                height: dimensions.height + 'px',
                left: dimensions.x + 'px',
                top: dimensions.y + 'px'
            });

            function debounce(func, wait) {
                let timeout;
                return function (...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            }

            function handleResize() {
                const browserWidth = window.innerWidth;
                const browserHeight = window.innerHeight;

                const { left: currentX, top: currentY } = window_wrapper.position();
                let { width: currentWidth, height: currentHeight } = window_wrapper.size();

                currentWidth = Math.min(currentWidth, browserWidth);
                currentHeight = Math.min(currentHeight, browserHeight);
                const newX = Math.min(currentX, browserWidth - currentWidth);
                const newY = Math.min(currentY, browserHeight - currentHeight);

                window_wrapper.css({
                    width: `${currentWidth}px`,
                    height: `${currentHeight}px`,
                    left: `${newX}px`,
                    top: `${newY}px`
                });
            }

            window.addEventListener('resize', debounce(handleResize, 300));

            close.on('click', function () {

                window_wrapper.animate(200, {
                    opacity: 0,
                    transform: 'scale(0.8)'
                }, function () {
                    window_wrapper.hide();
                });

            });

            minimize.on('click', function () {
                content.toggle();

                if (maximized) {
                    maximized = false;
                    maximize.html(Icon('window-full'));
                    window_wrapper.animate(animation_speed, {
                        width: dimensions.width + 'px',
                        height: dimensions.height + 'px',
                        left: dimensions.x + 'px',
                        top: dimensions.y + 'px'
                    }, function () {
                        window_wrapper.removeTransition();
                    });
                }

                if (minimized) {
                    minimize.html(Icon('window-minimize'));
                    window_wrapper.css({
                        height: dimensions.height + 'px'
                    });
                    minimized = false;
                    handleResize();

                } else {
                    minimize.html(Icon('window-windowed'));
                    window_wrapper.css({
                        height: titlebar.height() + 'px'
                    });
                    minimized = true;
                }
            });

            maximize.on('click', function () {

                if (minimized) {
                    minimize.html(Icon('window-minimize'));
                    minimized = false;
                    if (!content.is(':visible')) {
                        content.toggle();
                    }
                }

                if (maximized) {
                    maximized = false;
                    maximize.html(Icon('window-full'));
                    window_wrapper.animate(animation_speed, {
                        width: dimensions.width + 'px',
                        height: dimensions.height + 'px',
                        left: dimensions.x + 'px',
                        top: dimensions.y + 'px'
                    }, function () {
                        window_wrapper.removeTransition();
                        handleResize();
                    });

                } else {
                    maximized = true;
                    maximize.html(Icon('window-windowed'));
                    window_wrapper.animate(animation_speed, {
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        borderRadius: 0
                    }, function () {
                        window_wrapper.removeTransition();
                    });
                }
            });

            const zindex = () => {
                let highestZIndex = 0;
                Q('.q_window').each(function () {
                    let zIndex = parseInt(Q(this).css('z-index'));
                    if (zIndex > highestZIndex) {
                        highestZIndex = zIndex;
                    }
                });
                return highestZIndex + 1;

            };


            titlebar.on('pointerdown', function (e) {
                let offset = window_wrapper.position();
                let x = e.clientX - offset.left;
                let y = e.clientY - offset.top;

                window_wrapper.css({
                    'z-index': zindex()
                });


                const pointerMoveHandler = function (e) {

                    let left = e.clientX - x;
                    let top = e.clientY - y;


                    left = Math.max(0, left);
                    top = Math.max(0, top);

                    let currentWidth = window_wrapper.width();
                    let currentHeight = window_wrapper.height();


                    left = Math.min(window.innerWidth - currentWidth, left);
                    top = Math.min(window.innerHeight - currentHeight, top);

                    dimensions.x = left;
                    dimensions.y = top;

                    window_wrapper.css({
                        left: dimensions.x + 'px',
                        top: dimensions.y + 'px'
                    });

                };

                const pointerUpHandler = function () {
                    Q(document).off('pointermove', pointerMoveHandler);
                    Q(document).off('pointerup', pointerUpHandler);
                };

                Q(document).on('pointermove', pointerMoveHandler);
                Q(document).on('pointerup', pointerUpHandler);
            });

            window_wrapper.show = function () {
                if (window_wrapper.isExists()) {
                    window_wrapper.fadeIn(200);
                }
                else {
                    Q('body').append(window_wrapper);
                }
            };

            window_wrapper.hide = function () {
                window_wrapper.fadeOut(200);
            };

            window_wrapper.title = function (newTitle) {
                if (newTitle !== undefined) {
                    titletext.text(newTitle);
                }
                return titletext.text();
            };

            window_wrapper.content = function (newContent) {
                if (newContent !== undefined) {
                    content.html(newContent);
                }
            };

            // window_wrapper.position = function (x, y) {
            //     if (x !== undefined && y !== undefined) {
            //         dimensions.x = x;
            //         dimensions.y = y;
            //         window_wrapper.css({
            //             left: dimensions.x + 'px',
            //             top: dimensions.y + 'px'
            //         });
            //     }
            //     return { x: window_wrapper.offset().left, y: window_wrapper.offset().top };
            // };

            // window_wrapper.size = function (width, height) {
            //     if (width !== undefined && height !== undefined) {
            //         dimensions.width = width;
            //         dimensions.height = height;
            //         window_wrapper.css({
            //             width: dimensions.width + 'px',
            //             height: dimensions.height + 'px'
            //         });
            //     }
            //     return { width: window_wrapper.width(), height: window_wrapper.height() };
            // };

            window_wrapper.close = function () {
                close.click();
            };

            window_wrapper.minimize = function () {
                minimize.click();
            };

            window_wrapper.maximize = function () {
                maximize.click();
            };

            window_wrapper.remove = function () {
                window_wrapper.remove();
            };

            return window_wrapper;
        },

        CheckBox: function (checked = false, text = '') {
            let ID = '_' + Q.ID();
            const container = Q('<div class="' + classes.q_form + ' ' + classes.q_form_checkbox + '">');
            const checkbox_container = Q('<div class="' + classes.q_form_cb + '">');
            const input = Q(`<input type="checkbox" id="${ID}">`);
            const label = Q(`<label for="${ID}">${text}</label>`);
            const labeltext = Q(`<div class="label">${text}</div>`);
            checkbox_container.append(input, label);
            container.append(checkbox_container, labeltext);

            container.checked = function (state) {
                input.prop('checked', state);
                if (state) {
                    input.trigger('change');
                }
            };

            container.change = function (callback) {
                input.on('change', function () {
                    callback(this.checked);
                });
            };

            container.disabled = function (state) {
                input.prop('disabled', state);
                if (state) {
                    container.addClass(classes.q_form_disabled);
                } else {
                    container.removeClass(classes.q_form_disabled);
                }
            };

            container.text = function (text) {
                labeltext.text(text);
            };

            return container;

        },

        TextBox: function (type = 'text', value = '', placeholder = '') {
            const input = Q(`<input class="${classes.q_form} ${classes.q_form_input}" type="${type}" placeholder="${placeholder}" value="${value}">`);

            input.placeholder = function (text) {
                input.attr('placeholder', text);
            };
            input.disabled = function (state) {
                input.prop('disabled', state);

                if (state) {
                    input.addClass(classes.q_form_disabled);
                } else {
                    input.removeClass(classes.q_form_disabled);
                }
            };
            input.reset = function () {
                input.val('');
            };
            input.change = function (callback) {
                input.on('change', function () {
                    callback(this.value);
                });
            };

            return input;
        },

        TextArea: function (value = '', placeholder = '') {
            const textarea = Q(`<textarea class="${classes.q_form} ${classes.q_form_textarea}" placeholder="${placeholder}">${value}</textarea>`);

            textarea.placeholder = function (text) {
                textarea.attr('placeholder', text);
            };
            textarea.disabled = function (state) {
                textarea.prop('disabled', state);
                if (state) {
                    textarea.addClass(classes.q_form_disabled);
                } else {
                    textarea.removeClass(classes.q_form_disabled);
                }
            };
            textarea.reset = function () {
                textarea.val('');
            };
            textarea.change = function (callback) {
                textarea.on('change', function () {
                    callback(this.value);
                });
            };
            return textarea;
        },
        Radio: function (data) {
            let wrapper = Q('<div class="q_form q_form_radio_wrapper">');
            let radios = [];

            data.forEach((item, index) => {
                let ID = '_' + Q.ID();
                const container = Q('<div class="' + classes.q_form + ' ' + classes.q_form_radio + '">');
                const radio_container = Q('<div class="' + classes.q_form_r + '">');
                const input = Q(`<input type="radio" id="${ID}" name="${item.name}" value="${item.value}">`);
                const label = Q(`<label for="${ID}"></label>`);
                const labeltext = Q(`<div class="label">${item.text}</div>`);

                if (item.disabled) {
                    input.prop('disabled', true);
                    container.addClass(classes.q_form_disabled);
                }

                radios.push({ container, input, labeltext });

                radio_container.append(input, label);
                container.append(radio_container, labeltext);
                wrapper.append(container);
            });

            wrapper.change = function (callback) {
                radios.forEach(radio => {
                    radio.input.on('change', function () {
                        if (this.checked) {
                            callback(this.value);
                        }
                    });
                });
            };
            wrapper.select = function (value) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.input.prop('checked', true).trigger('click');
                    }
                });
            };
            wrapper.disabled = function (value, state) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.input.prop('disabled', state);

                        if (state) {
                            radio.container.addClass(classes.q_form_disabled);
                        } else {
                            radio.container.removeClass(classes.q_form_disabled);
                        }
                    }
                });
            };
            wrapper.text = function (value, text) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.labeltext.text(text);
                    }
                });
            };
            wrapper.remove = function (value) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.container.remove();
                    }
                });
            };
            wrapper.reset = function () {
                radios.forEach(radio => radio.input.prop('checked', false));
            };
            wrapper.checked = function (value, state) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.input.prop('checked', state);
                    }
                });
            };
            return wrapper;
        }
    };

};