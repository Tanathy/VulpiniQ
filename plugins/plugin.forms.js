Q.Form = function () {
    Q.style(`
.q_form {
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    margin: 1px;
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

    `);
    return {

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

            //We should make sure that the window is not going outside the viewport

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


            //when window size changes we should make sure that the window is not going outside the viewport
            // Debounce function to limit the rate at which a function can fire
            function debounce(func, wait) {
                console.log('debounce');
                let timeout;
                return function (...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            }

            // Resize handler function
            function handleResize() {
                let browserWidth = window.innerWidth;
                let browserHeight = window.innerHeight;

                // Get the current position of the window
                let currentPosition = window_wrapper.position();
                let currentX = currentPosition.left;
                let currentY = currentPosition.top;

                // Constrain width and height within browser dimensions
                width = Math.min(width, browserWidth);
                height = Math.min(height, browserHeight);

                // Adjust currentX and currentY to ensure the window stays within bounds
                currentX = Math.min(currentX, browserWidth - width);
                currentY = Math.min(currentY, browserHeight - height);

                // Apply the constrained dimensions and positions
                window_wrapper.css({
                    width: width + 'px',
                    height: height + 'px',
                    left: currentX + 'px',
                    top: currentY + 'px'
                });
            }

            // Wrap the resize handler with debounce
            window.addEventListener('resize', debounce(handleResize, 300));


            close.on('click', function () {
                // window_wrapper.fadeOut(200);

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

                    //this should expand the window to the original size
                    window_wrapper.css({
                        height: height + 'px'
                    });
                    handleResize();

                } else {
                    minimize.text('+');

                    //this should shrink the window to the titlebar
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

            //here we should make the logic for moving the window when dragging the titlebar
            titlebar.on('pointerdown', function (e) {
                let offset = window_wrapper.offset();
                let x = e.clientX - offset.left;
                let y = e.clientY - offset.top;

                window_wrapper.css({
                    'z-index': zindex()
                });

                // Define the event handlers
                const pointerMoveHandler = function (e) {
                    // Ensure the window is not going outside the viewport
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

                // Attach the event handlers to the document
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

        Tab: function (data, horizontal = true) {

            let wrapper = Q('<div class="q_tabcontainer">');
            let tabs_wrapper = Q('<div class="q_tabs_wrapper">');
            let tabs_nav_left = Q('<div class="q_tabs_nav q_tabs_nav_left">');
            let tabs_nav_right = Q('<div class="q_tabs_nav q_tabs_nav_right">');
            let tabs = Q('<div class="q_tabs">');
            tabs_wrapper.append(tabs_nav_left, tabs, tabs_nav_right);
            let content = Q('<div class="q_tabcontent">');
            wrapper.append(tabs_wrapper, content);

            if (!horizontal) {
                wrapper.addClass('q_tc_vertical');
                tabs.addClass('q_tabs_vertical');
                tabs_wrapper.addClass('q_tabs_wrapper_vertical');
                tabs_nav_left.addClass('q_tabs_nav_vertical');
                tabs_nav_right.addClass('q_tabs_nav_vertical');
            }

            let data_tabs = {};
            let data_contents = {};

            data.forEach((item, index) => {
                const tab = Q(`<div class="q_tab" data-value="${item.value}">${item.title}</div>`);
                if (item.disabled) {
                    tab.addClass('q_tab_disabled');
                }

                data_tabs[item.value] = tab;
                data_contents[item.value] = item.content;

                tab.on('click', function () {

                    if (item.disabled) {
                        return;
                    }

                    let foundTabs = tabs.find('.q_tab_active');

                    if (foundTabs) {
                        foundTabs.removeClass('q_tab_active');
                    }

                    tab.addClass('q_tab_active');
                    content.html(data_contents[item.value]);
                });
                tabs.append(tab);
            });

            tabs_nav_left.on('click', function () {

                if (!horizontal) {
                    tabs.scrollTop(-tabs.height(), true);
                } else {
                    tabs.scrollLeft(-tabs.width(), true);
                }
            });

            tabs_nav_right.on('click', function () {

                if (!horizontal) {
                    tabs.scrollTop(tabs.height(), true);
                } else {
                    tabs.scrollLeft(tabs.width(), true);
                }
            });

            wrapper.select = function (value) {
                data_tabs.forEach(tab => {
                    if (tab.data('value') === value) {
                        tab.click();
                    }
                });
            };

            return wrapper;
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