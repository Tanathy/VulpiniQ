Q.Form = function () {
    Q.style(`
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

.q_tabs_nav {
    width: 20px;
    background-color: #333;
    display: flex;
}

.q_tabs_nav_vertical {
    width: auto;
    height: 20px;
}

.q_tabs_nav:hover {
    background-color: #555;
}

.q_tabcontainer {
    width: 100%;
    height: 300px;
}

.q_tc_vertical {
display: flex;
        }

.q_tabs_wrapper {

    background-color: #333;
    display: flex;
}

.q_tabs_wrapper_vertical {
    flex-direction: column;
        width: auto;
}

.q_tabs {
user-select: none;
    display: flex;
    flex-direction: row;
    width: 100%;
    overflow: hidden;
}

.q_tabs_vertical {
    flex-direction: column;
}

.q_tab_active {
    background-color: #555;
    color: #fff;
}

.q_tab {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    padding: 5px 25px;
}

.q_tab_disabled {
    background-color: #333;
    color: #555;
}

.q_window {
position: fixed;
    background-color: #333;
    z-index: 1000;
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.3);
    }

.q_window_titlebar {
user-select: none;
    display: flex;
    background-color: #222;
    width: 100%;
}

.q_window_buttons {
    display: flex;
}

.q_window_button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 30px;
    height: 30px;
}

.q_window_titletext {
    flex-grow: 1;
    color: #fff;
    align-content: center;
}

.q_window_content {
width: 100%;
overflow-y: auto;
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
    background-color: #1DA1F2;
}

.q_form_slider
{
    width: 100%;
    opacity: 0;
    height: 100%;
    position: absolute;
}


.q_form_dropdown
{
user-select: none;
    position: relative;
    background-color: #333;
    }

.q_form_dropdown_options
{
    position: absolute;
    width: 100%;
    background-color: #333;
    z-index: 1;
    }

.q_form_dropdown_option, .q_form_dropdown_selected
{
    padding: 5px 0px;
    }

    .q_form_button
    {
    user-select: none;
        padding: 5px 10px;
        cursor: pointer;
    }

    .q_form_button:hover
    {
        background-color: #555;
    }

    .q_form_button:active
    {
        background-color: #777;
    }

    .q_form_file
    {
    user-select: none;
    position: relative;
    overflow: hidden;
    }

    .q_form_file input[type="file"]
    {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    }

    `);
    return {

        ProgressBar: function (value = 0, min = 0, max = 100, autoKill = 0) {
            let timer = null;
            const progress = Q('<div class="q_form q_form_progress">');
            const bar = Q('<div class="q_form_progress_bar">');
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

        Button: function (text = '') {
            const button = Q(`<div class="q_form q_form_button">${text}</div>`);

            button.click = function (callback) {
                button.on('click', callback);
            };

            button.disabled = function (state) {
                if (state) {
                    button.addClass('q_form_disabled');
                }
                else {
                    button.removeClass('q_form_disabled');
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

        File: function (text = '', accept = '*', multiple = false) {
            const container = Q('<div class="q_form q_form_file q_form_button">');
            const input = Q(`<input type="file" accept="${accept}" ${multiple ? 'multiple' : ''}>`);
            const label = Q(`<div>${text}</div>`);
            container.append(input, label);

            input.disabled = function (state) {
                input.prop('disabled', state);
                if (state) {
                    container.addClass('q_form_disabled');
                } else {
                    container.removeClass('q_form_disabled');
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
            let wrapper = Q('<div class="q_form q_form_dropdown">');
            let selected = Q('<div class="q_form_dropdown_selected">');
            let options = Q('<div class="q_form_dropdown_options">');

            options.hide();
            wrapper.append(selected, options);

            
            let valueMap = new Map();

            data.forEach((item, index) => {
                let option = Q('<div class="q_form_dropdown_option">');
                option.html(item.content);
                if (item.disabled) {
                    option.addClass('q_form_disabled');
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
            options.find('.q_form_dropdown_option').first().addClass('q_form_dropdown_active');

            options.on('click', function (e) {
                let target = Q(e.target);
                if (target.hasClass('q_form_dropdown_option') && !target.hasClass('q_form_disabled')) {
                    selected.html(target.html());
                    selectedValue = valueMap.get(target);
                    deselect();
                    options.find('.q_form_dropdown_option').removeClass('q_form_dropdown_active');
                    target.addClass('q_form_dropdown_active');
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
                    if (target.hasClass('q_form_dropdown_option') && !target.hasClass('q_form_dropdown_disabled')) {
                        callback(valueMap.get(target));
                    }
                });
            };

            wrapper.select = function (value) {
                options.find('.q_form_dropdown_option').each(function () {
                    let option = Q(this);
                    if (valueMap.get(option) === value) {
                        selected.html(option.html());
                        selectedValue = value;
                        deselect();
                        options.find('.q_form_dropdown_option').removeClass('q_form_dropdown_active');
                        option.addClass('q_form_dropdown_active');
                    }
                });
            };

            wrapper.disabled = function (value, state) {
                options.find('.q_form_dropdown_option').each(function () {
                    let option = Q(this);
                    if (valueMap.get(option) === value) {
                        option.prop('disabled', state);
                        if (state) {
                            option.addClass('q_form_disabled');
                        } else {
                            option.removeClass('q_form_disabled');
                        }
                    }
                });
            };

            wrapper.remove = function (value) {
                options.find('.q_form_dropdown_option').each(function () {
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
            const slider = Q('<input type="range" class="q_form_slider">');
            slider.attr('min', min);
            slider.attr('max', max);
            slider.attr('value', value);

            let slider_wrapper = Q('<div class="q_form q_slider_wrapper">');
            let slider_value = Q('<div class="q_slider_pos">');
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
                    slider_wrapper.addClass('q_form_disabled');
                } else {
                    slider_wrapper.removeClass('q_form_disabled');
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

        Window: function (title = '', data, width = 300, height = 300, x = 0, y = 0) {
            let window_wrapper = Q('<div class="q_window">');
            let titlebar = Q('<div class="q_window_titlebar">');
            let titletext = Q('<div class="q_window_titletext">');
            let uniqueButtons = Q('<div class="q_window_unique_buttons">');
            let default_buttons = Q('<div class="q_window_buttons">');
            let content = Q('<div class="q_window_content">');
            let close = Q('<div class="q_window_button q_window_close">');
            let minimize = Q('<div class="q_window_button q_window_minimize">');
            let maximize = Q('<div class="q_window_button q_window_maximize">');

            close.text('X');
            minimize.text('-');
            maximize.text('+');
            content.append(data);

            titletext.text(title);

            titletext.attr('title', title);

            titlebar.append(titletext, uniqueButtons, default_buttons);
            default_buttons.append(minimize, maximize, close);
            window_wrapper.append(titlebar, content);

            

            width = width > window_wrapper.parent().width() ? window_wrapper.parent().width() : width;
            height = height > window_wrapper.parent().height() ? window_wrapper.parent().height() : height;
            x = x + width > window_wrapper.parent().width() ? window_wrapper.parent().width() - width : x;
            y = y + height > window_wrapper.parent().height() ? window_wrapper.parent().height() - height : y;

            window_wrapper.css({
                width: width + 'px',
                height: height + 'px',
                left: x + 'px',
                top: y + 'px'
            });


            
            
            function debounce(func, wait) {
                console.log('debounce');
                let timeout;
                return function (...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            }

            
            function handleResize() {
                let browserWidth = window.innerWidth;
                let browserHeight = window.innerHeight;

                
                let currentPosition = window_wrapper.position();
                let currentX = currentPosition.left;
                let currentY = currentPosition.top;

                
                width = Math.min(width, browserWidth);
                height = Math.min(height, browserHeight);

                
                currentX = Math.min(currentX, browserWidth - width);
                currentY = Math.min(currentY, browserHeight - height);

                
                window_wrapper.css({
                    width: width + 'px',
                    height: height + 'px',
                    left: currentX + 'px',
                    top: currentY + 'px'
                });
            }

            
            window.addEventListener('resize', debounce(handleResize, 300));


            close.on('click', function () {
                

                window_wrapper.animate(200, {
                    opacity: 0,
                    transform: 'scale(0.9)'
                }, function () {
                    window_wrapper.hide();
                });

            });

            minimize.on('click', function () {
                content.toggle();

                if (content.is(':visible')) {
                    minimize.text('-');

                    
                    window_wrapper.css({
                        height: height + 'px'
                    });
                    handleResize();

                } else {
                    minimize.text('+');

                    
                    window_wrapper.css({
                        height: titlebar.height() + 'px'
                    });

                }

            });

            maximize.on('click', function () {
                if (window_wrapper.height() === window.innerHeight) {
                    window_wrapper.css({
                        width: width + 'px',
                        height: height + 'px',
                        left: x + 'px',
                        top: y + 'px'
                    });
                } else {
                    window_wrapper.css({
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0
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
                let offset = window_wrapper.offset();
                let x = e.clientX - offset.left;
                let y = e.clientY - offset.top;

                window_wrapper.css({
                    'z-index': zindex()
                });

                
                const pointerMoveHandler = function (e) {
                    
                    let left = e.clientX - x;
                    let top = e.clientY - y;

                    if (left < 0) {
                        left = 0;
                    }

                    if (top < 0) {
                        top = 0;
                    }

                    if (left + window_wrapper.width() > window.innerWidth) {
                        left = window.innerWidth - window_wrapper.width();
                    }

                    if (top + window_wrapper.height() > window.innerHeight) {
                        top = window.innerHeight - window_wrapper.height();
                    }

                    window_wrapper.css({
                        left: left + 'px',
                        top: top + 'px'
                    });
                };

                const pointerUpHandler = function () {
                    Q('document').off('pointermove', pointerMoveHandler);
                    Q('document').off('pointerup', pointerUpHandler);
                };

                
                Q('document').on('pointermove', pointerMoveHandler);
                Q('document').on('pointerup', pointerUpHandler);
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
                return content.html();
            };

            window_wrapper.position = function (x, y) {
                if (x !== undefined && y !== undefined) {
                    window_wrapper.css({
                        left: x + 'px',
                        top: y + 'px'
                    });
                }
                return { x: window_wrapper.offset().left, y: window_wrapper.offset().top };
            };

            window_wrapper.size = function (width, height) {
                if (width !== undefined && height !== undefined) {
                    window_wrapper.css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                }
                return { width: window_wrapper.width(), height: window_wrapper.height() };
            };

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
            const container = Q('<div class="q_form q_form_checkbox">');
            const checkbox_container = Q('<div class="q_form_cb">');
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
                    container.addClass('q_form_disabled');
                } else {
                    container.removeClass('q_form_disabled');
                }
            };

            container.text = function (text) {
                labeltext.text(text);
            };

            return container;

        },

        TextBox: function (type = 'text', value = '', placeholder = '') {
            const input = Q(`<input class="q_form q_form_input" type="${type}" placeholder="${placeholder}" value="${value}">`);

            input.placeholder = function (text) {
                input.attr('placeholder', text);
            };
            input.disabled = function (state) {
                input.prop('disabled', state);

                if (state) {
                    input.addClass('q_form_disabled');
                } else {
                    input.removeClass('q_form_disabled');
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
            const textarea = Q(`<textarea class="q_form q_form_textarea" placeholder="${placeholder}">${value}</textarea>`);

            textarea.placeholder = function (text) {
                textarea.attr('placeholder', text);
            };
            textarea.disabled = function (state) {
                textarea.prop('disabled', state);
                if (state) {
                    textarea.addClass('q_form_disabled');
                } else {
                    textarea.removeClass('q_form_disabled');
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
                const container = Q('<div class="q_form q_form_radio">');
                const radio_container = Q('<div class="q_form_r">');
                const input = Q(`<input type="radio" id="${ID}" name="${item.name}" value="${item.value}">`);
                const label = Q(`<label for="${ID}"></label>`);
                const labeltext = Q(`<div class="label">${item.text}</div>`);

                if (item.disabled) {
                    input.prop('disabled', true);
                    container.addClass('q_form_disabled');
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
                            radio.container.addClass('q_form_disabled');
                        } else {
                            radio.container.removeClass('q_form_disabled');
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