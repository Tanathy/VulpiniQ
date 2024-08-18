const Q = (() => {
    'use strict';

    function Q(selector, attributes, directProps) {
        if (!(this instanceof Q)) {
            return new Q(selector, attributes, directProps);
        }

        if (selector instanceof HTMLElement || selector instanceof Node) {
            this.nodes = [selector];
            return;
        }

        if (typeof selector === 'string') {
            const isCreating = selector.includes('<');

            if (isCreating) {
                const fragment = document.createDocumentFragment();
                const pseudoElement = document.createElement('div');
                pseudoElement.innerHTML = selector;
                while (pseudoElement.firstChild) {
                    fragment.appendChild(pseudoElement.firstChild);
                }
                this.nodes = Array.from(fragment.childNodes);

                if (attributes) {
                    this.nodes.forEach(el => {
                        for (const [attr, value] of Object.entries(attributes)) {
                            if (attr === 'class') {
                                el.classList.add(...value.split(' '));
                            } else {
                                el.setAttribute(attr, value);
                            }
                        }
                    });
                }

                if (directProps) {
                    this.nodes.forEach(el => {
                        for (const prop of directProps) {
                            el[prop] = true;
                        }
                    });
                }
            } else {
                this.nodes = Array.from(this._querySelector(selector));
            }
        }
    }

    Q.prototype._querySelector = function (selector) {
        switch (selector) {
            case 'body':
                return [document.body];
            case 'head':
                return [document.head];
            default:
                return document.querySelectorAll(selector);
        }
    };

    Q.register = (type, name, pluginFunction) => {
        if (!pluginFunction) {
            pluginFunction = name;
            name = type;
            type = 'Q';
        }

        const prototype = type === 'Q' ? Q.prototype : Q[type]?.prototype;

        if (!prototype) {
            return console.error(`Unknown plugin type: ${type}`);
        }
        if (prototype[name]) {
            return console.error(`Plugin ${name} already exists on ${type}.prototype`);
        }

        prototype[name] = pluginFunction;
    };

    Q.prototype.each = function (callback) {
        this.nodes.forEach((el, index) => callback.call(el, index, el));
        return this;
    };

    Q.ID = function (length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    Q.UUID4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    Q.prototype.text = function (content) {
        if (content === undefined) {
            return this.nodes[0]?.textContent || null;
        }
        return this.each(el => this.nodes[el].textContent = content);
    };

    Q.prototype.html = function (content, outer = false) {
        if (content === undefined) {
            if (outer) {
                return this.nodes[0]?.outerHTML || null;
            }
            return this.nodes[0]?.innerHTML || null;
        }
        return this.each(el => {
            el = this.nodes[el];
            if (typeof content === 'string') {
                el.innerHTML = content;
            } else if (content instanceof HTMLElement || content instanceof Q) {
                el.innerHTML = '';
                new Q(content).each(child => el.appendChild(child));
            } else if (Array.isArray(content) || content instanceof NodeList) {
                el.innerHTML = '';
                Array.from(content).forEach(child => el.appendChild(child));
            }
        });
    };

    Q.prototype.addClass = function (classes) {
        const classList = classes.split(' ');
        return this.each(el => this.nodes[el].classList.add(...classList));
    };

    Q.prototype.removeClass = function (classes) {
        const classList = classes.split(' ');
        return this.each(el => this.nodes[el].classList.remove(...classList));
    };

    Q.prototype.toggleClass = function (className) {
        return this.each(el => this.nodes[el].classList.toggle(className));
    };

    Q.prototype.val = function (value) {
        if (value === undefined) {
            return this.nodes[0]?.value || null;
        }
        return this.each(el => this.nodes[el].value = value);
    };

    Q.prototype.data = function (key, value) {
        if (value === undefined) {
            return this.nodes[0]?.dataset[key] || null;
        }
        return this.each(el => this.nodes[el].dataset[key] = value);
    };

    Q.prototype.removeData = function (key) {
        return this.each(el => delete this.nodes[el].dataset[key]);
    };

    Q.prototype.css = function (property, value) {
        if (value === undefined) {
            return getComputedStyle(this.nodes[0])[property];
        }
        return this.each(el => this.nodes[el].style[property] = value);
    };

    Q.prototype.attr = function (attribute, value) {
        if (value === undefined) {
            return this.nodes[0]?.getAttribute(attribute) || null;
        }
        return this.each(el => this.nodes[el].setAttribute(attribute, value));
    };

    Q.prototype.prop = function (property, value) {
        if (value === undefined) {
            return this.nodes[0]?.[property] || null;
        }
        return this.each(function (index, el) {
            el[property] = value;
        });
    };

    Q.prototype.removeProp = function (property) {
        return this.each(el => delete this.nodes[el][property]);
    }

    Q.prototype.trigger = function (event) {
        return this.each(function (index, el) {
            el.dispatchEvent(new Event(event));
        });
    };

    Q.prototype.removeAttr = function (attribute) {
        return this.each(el => this.nodes[el].removeAttribute(attribute));
    };

    Q.prototype.append = function (...nodes) {
        return this.each(el => {
            const parent = this.nodes[el];

            nodes.forEach(child => {

                if (typeof child === 'string') {
                    parent.insertAdjacentHTML('beforeend', child);
                } else if (child instanceof HTMLElement || child instanceof Q) {
                    parent.appendChild(child.nodes[0]);
                } else if (Array.isArray(child) || child instanceof NodeList) {
                    Array.from(child).forEach(subchild => parent.appendChild(subchild));
                }
            });
        });
    };

    Q.prototype.prepend = function (...nodes) {
        return this.each(el => {
            const parent = this.nodes[el];

            nodes.forEach(child => {
                if (typeof child === 'string') {
                    parent.insertAdjacentHTML('afterbegin', child);
                } else if (child instanceof HTMLElement || child instanceof Q) {
                    parent.insertBefore(child.nodes[0], parent.firstChild);
                } else if (Array.isArray(child) || child instanceof NodeList) {
                    Array.from(child).forEach(subchild => parent.insertBefore(subchild, parent.firstChild));
                }
            });
        });
    };

    Q.prototype.remove = function () {
        return this.each(el => this.nodes[el].remove());
    };

    Q.prototype.empty = function () {
        return this.each(el => this.nodes[el].innerHTML = '');
    };

    Q.prototype.clone = function () {
        return new Q(this.nodes[0].cloneNode(true));
    };

    Q.prototype.parent = function () {
        return new Q(this.nodes[0].parentNode);
    };

    Q.prototype.children = function () {
        return new Q(this.nodes[0].children);
    };

    Q.prototype.find = function (selector) {
        return new Q(this.nodes[0].querySelectorAll(selector));
    };

    Q.prototype.closest = function (selector) {
        let el = this.nodes[0];
        while (el) {
            if (el.matches(selector)) return new Q(el);
            el = el.parentElement;
        }
        return null;
    };

    Q.prototype.first = function () {
        return new Q(this.nodes[0]);
    };

    Q.prototype.last = function () {
        return new Q(this.nodes[this.nodes.length - 1]);
    };

    Q.prototype.eq = function (index) {
        return new Q(this.nodes[index]);
    };

    Q.prototype.index = function (index) {
        if (index === undefined) {
            return Array.from(this.nodes[0].parentNode.children).indexOf(this.nodes[0]);
        }
        return this.each(el => {
            const parent = this.nodes[el].parentNode;
            const siblings = Array.from(parent.children);
            const position = siblings.indexOf(el);
            const target = siblings.splice(index, 1)[0];
            if (position < index) {
                parent.insertBefore(target, el);
            } else {
                parent.insertBefore(target, this.nodes[el].nextSibling);
            }
        });
    };

    Q.style = function (styles) {
        let styleElement = document.getElementById('qlib-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'qlib-styles';
            document.head.appendChild(styleElement);
        }

        if (typeof styles === 'string') {
            styleElement.appendChild(document.createTextNode(styles));
        } else if (styles && typeof styles === 'object') {
            const cssText = Object.entries(styles).map(([prop, val]) => `${prop}: ${val};`).join(' ');
            const ruleIndex = Array.from(styleElement.sheet.cssRules).findIndex(rule => rule.selectorText === selector);

            if (ruleIndex === -1) {
                styleElement.sheet.insertRule(`${selector} { ${cssText} }`);
            } else {
                styleElement.sheet.deleteRule(ruleIndex);
                styleElement.sheet.insertRule(`${selector} { ${cssText} }`, ruleIndex);
            }
        } else {
            console.error('Invalid styles parameter. Expected a string or an object.');
        }
    };

    Q.removeStyle = function () {
        const styleElement = document.getElementById('qlib-styles');
        styleElement?.parentNode.removeChild(styleElement);
    };

    // #region Animation
    Q.prototype.show = function () {
        return this.each(el => this.nodes[el].style.display = '');
    };

    Q.prototype.hide = function () {
        return this.each(el => this.nodes[el].style.display = 'none');
    };

    Q.prototype.fadeIn = function (duration = 400, callback) {
        return this.each(el => {
            this.nodes[el].style.display = '';
            this.nodes[el].style.transition = `opacity ${duration}ms`;
            this.nodes[el].style.opacity = 1;
            setTimeout(() => {
                this.nodes[el].style.transition = '';
                if (callback) callback();
            }, duration);
        });
    };

    Q.prototype.fadeOut = function (duration = 400, callback) {
        return this.each(el => {
            this.nodes[el].style.transition = `opacity ${duration}ms`;
            this.nodes[el].style.opacity = 0;
            setTimeout(() => {
                this.nodes[el].style.transition = '';
                this.nodes[el].style.display = 'none';
                if (callback) callback();
            }, duration);
        });
    };

    Q.prototype.fadeToggle = function (duration = 400, callback) {
        return this.each(el => {
            if (this.nodes[el].style.opacity === '0') {
                this.fadeIn(duration, callback);
            } else {
                this.fadeOut(duration, callback);
            }
        });
    };

    Q.prototype.fadeTo = function (opacity, duration = 400, callback) {
        return this.each(el => {
            this.nodes[el].style.transition = `opacity ${duration}ms`;
            this.nodes[el].style.opacity = opacity;
            setTimeout(() => {
                this.nodes[el].style.transition = '';
                if (callback) callback();
            }, duration);
        });
    };
    // #endregion
    // #region Fetch and Socket
    Q.fetch = function (url, callback, options = {}) {
        const { method = 'GET', headers = {}, body, contentType = 'application/json', responseType = 'json', credentials = 'same-origin' } = options;
        headers['Content-Type'] = headers['Content-Type'] || contentType;

        fetch(url, { method, headers, body, credentials })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                switch (responseType) {
                    case 'json': return response.json();
                    case 'text': return response.text();
                    case 'blob': return response.blob();
                    case 'arrayBuffer': return response.arrayBuffer();
                    default: throw new Error('Unsupported response type');
                }
            })
            .then(data => callback(null, data))
            .catch(error => callback(error, null));
    };

    Q.socket = function (url, onMessage, onStatus, options = {}) {
        const { retries = 5, delay = 1000, protocols = [] } = options;
        let socket, attempts = 0;

        const connect = () => {
            socket = new WebSocket(url, protocols);
            socket.onopen = () => { onStatus?.('connected'); attempts = 0; };
            socket.onmessage = event => onMessage?.(event.data);
            socket.onerror = error => onStatus?.('error', error);
            socket.onclose = () => {
                if (++attempts <= retries) {
                    onStatus?.('closed');
                    setTimeout(connect, delay);
                } else {
                    onStatus?.('Max retries exceeded');
                }
            };
        };
        connect();

        return {
            send: msg => socket.readyState === WebSocket.OPEN && socket.send(msg),
            reconnect: () => connect(),
            close: () => socket.close()
        };
    };
    // #endregion
    // #region String manipulation
    Q.String = function (string) {
        if (!(this instanceof Q.String)) {
            return new Q.String(string);
        }
        this.string = string;
    };

    Q.String.prototype.capitalize = function () {
        return this.string.charAt(0).toUpperCase() + this.string.slice(1);
    };

    Q.String.prototype.levenshtein = function (string) {
        const a = this.string, b = string;
        const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i || j));

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
                );
            }
        }
        return matrix[a.length][b.length];
    };

    Q.String.prototype.find = function (stringOrRegex) {
        return this.string.match(stringOrRegex);
    };

    Q.String.prototype.replaceAll = function (stringOrRegex, replacement) {
        return this.string.replace(new RegExp(stringOrRegex, 'g'), replacement);
    };
    // #endregion
    // #region JSON manipulation
    Q.JSON = function (json) {
        if (!(this instanceof Q.JSON)) {
            return new Q.JSON(json);
        }
        this.json = json;
    };

    Q.JSON.prototype.Parse = function (options = { modify: false, recursive: false }, callback) {
        const process = (data) => {
            if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const newValue = callback(key, data[key]);
                        if (modify) {
                            data[key] = newValue;
                        }
                        if (recursive && typeof data[key] === 'object' && data[key] !== null) {
                            process(data[key]);
                        }
                    }
                }
            }
        };

        process(this.json);
        return this.json;
    };

    Q.JSON.prototype.deflate = function (level) {
        const map = {};
        let counter = 1;

        function replaceRecursive(obj) {
            if (typeof obj === 'object' && obj !== null) {
                for (let key in obj) {
                    if (typeof obj[key] === 'object') {
                        replaceRecursive(obj[key]);
                    }

                    if (key.length >= level) {
                        if (!map[key]) {
                            map[key] = `[${counter}]`;
                            counter++;
                        }
                        const newKey = map[key];
                        obj[newKey] = obj[key];
                        delete obj[key];
                    }

                    if (typeof obj[key] === 'string' && obj[key].length >= level) {
                        if (!map[obj[key]]) {
                            map[obj[key]] = `[${counter}]`;
                            counter++;
                        }
                        obj[key] = map[obj[key]];
                    }
                }
            }
        }

        const compressedData = JSON.parse(JSON.stringify(this.json));
        replaceRecursive(compressedData);

        return { data: compressedData, map: map };
    };

    Q.JSON.prototype.inflate = function (deflatedJson) {
        const { data, map } = deflatedJson;
        const reverseMap = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));

        function restoreRecursive(obj) {
            if (typeof obj === 'object' && obj !== null) {
                for (let key in obj) {
                    const originalKey = reverseMap[key] || key;
                    const value = obj[key];

                    delete obj[key];
                    obj[originalKey] = value;

                    if (typeof obj[originalKey] === 'object') {
                        restoreRecursive(obj[originalKey]);
                    } else if (reverseMap[obj[originalKey]]) {
                        obj[originalKey] = reverseMap[obj[originalKey]];
                    }
                }
            }
        }

        const inflatedData = JSON.parse(JSON.stringify(data));
        restoreRecursive(inflatedData);
        return inflatedData;
    };
    // #endregion
    // #region Timer
    Q.Timer = function (callback, id, options = {}) {
        const defaultOptions = {
            tick: 1,
            delay: 1000,
            interrupt: false
        };

        options = { ...defaultOptions, ...options };
        let tickCount = 0;
        let intervalId = null;

        if (!Q.Timer.activeTimers) {
            Q.Timer.activeTimers = new Map();
        }

        if (options.interrupt && Q.Timer.activeTimers.has(id)) {
            clearInterval(Q.Timer.activeTimers.get(id));
        }

        intervalId = setInterval(() => {
            callback();

            tickCount++;
            if (options.tick > 0 && tickCount >= options.tick) {
                clearInterval(intervalId);
                Q.Timer.activeTimers.delete(id);
            }
        }, options.delay);

        Q.Timer.activeTimers.set(id, intervalId);

        return intervalId;
    };

    Q.Timer.stop = function (id) {
        if (Q.Timer.activeTimers && Q.Timer.activeTimers.has(id)) {
            clearInterval(Q.Timer.activeTimers.get(id));
            Q.Timer.activeTimers.delete(id);
        }
    };

    Q.Timer.stopAll = function () {
        if (Q.Timer.activeTimers) {
            for (let intervalId of Q.Timer.activeTimers.values()) {
                clearInterval(intervalId);
            }
            Q.Timer.activeTimers.clear();
        }
    };
    // #endregion
    // #region Storage
    Q.Store = function (key, value) {
        if (arguments.length === 2) { // Check if two arguments are passed
            if (value === null || value === '') { // If value is null or empty string
                localStorage.removeItem(key); // Remove the item from localStorage
            } else {
                localStorage.setItem(key, JSON.stringify(value)); // Store the value as a JSON string
            }
        } else if (arguments.length === 1) { // Check if one argument is passed
            let storedValue = localStorage.getItem(key); // Retrieve the value from localStorage
            try {
                return JSON.parse(storedValue); // Try to parse the value as JSON
            } catch (e) {
                return storedValue; // Return the value as is if parsing fails
            }
        }
    };

    Q.Cookie = function (key, value, options = {}) {
        function _serialize(options) {
            const { days, path, domain, secure } = options;
            let cookieString = '';

            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                cookieString += `expires=${date.toUTCString()}; `;
            }
            if (path) {
                cookieString += `path=${path}; `;
            }
            if (domain) {
                cookieString += `domain=${domain}; `;
            }
            if (secure) {
                cookieString += 'secure; ';
            }
            return cookieString;
        }

        function _parse(cookieString) {
            return cookieString.split(';').reduce((cookies, cookie) => {
                const [name, value] = cookie.split('=').map(c => c.trim());
                cookies[name] = value;
                return cookies;
            }, {});
        }

        if (arguments.length === 2) { // Check if two arguments are passed
            if (value === null || value === '') { // If value is null or empty string
                value = ''; // Set the value to an empty string
                options = { ...options, days: -1 }; // Set the number of days to -1
            }
            return document.cookie = `${key}=${value}; ${_serialize(options)}`; // Set the cookie
        } else if (arguments.length === 1) { // Check if one argument is passed
            return _parse(document.cookie)[key]; // Retrieve the cookie value
        }
    };
    // #endregion
    // #region Form Builder
    Q.Form = function () {
        Q.style(`

.q_form
{
box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    margin: 1px;
}

.q_form_checkbox, .q_form_radio {
    display: flex;
    width: fit-content;
    align-items: center;
}

.q_form_checkbox .label:empty, .q_form_radio .label:empty {
    display: none;
}

.q_form_checkbox .label, .q_form_radio .label
{
padding-left: 5px;
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

.q_form_cb input[type="checkbox"]:checked + label:before {
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

.q_form_r input[type="radio"]:checked + label:before {
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

.q_form_input:focus, .q_form_textarea:focus {
    outline: 1px solid #1DA1F2;
}
    
.q_form_textarea {
    width: calc(100% - 2px);
    padding: 5px;
    outline: none;
    border: 0;
}

    `);
        return {
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

    // #endregion
    // #region Task Manager
    const taskManager = (() => {
        const tasks = {};
        const runningTasks = {};

        function createTask(id) {
            if (!tasks[id]) {
                tasks[id] = [];
            }
        }

        function addTask(id, ...functions) {
            if (!tasks[id]) {
                createTask(id);
            }
            tasks[id].push(...functions);
        }

        async function runTask(id) {
            if (!tasks[id] || tasks[id].length === 0) {
                console.error(`No tasks found with ID: ${id}`);
                return;
            }

            runningTasks[id] = {
                doneCallback: null,
                failCallback: null,
                timeout: 20000, // Default timeout is 20 seconds
                timeoutCallback: null,
            };

            const { timeout, timeoutCallback } = runningTasks[id];
            const timeoutPromise = new Promise((_, reject) => {
                const timer = setTimeout(() => {
                    abortTask(id);
                    reject(new Error(`Task with ID: ${id} timed out after ${timeout / 1000} seconds`));
                }, timeout);

                runningTasks[id].timeoutClear = () => clearTimeout(timer);
            });

            try {
                await Promise.race([
                    (async () => {
                        for (const task of tasks[id]) {
                            await new Promise((resolve, reject) => {
                                try {
                                    const result = task();
                                    if (result instanceof Promise) {
                                        result.then(resolve).catch(reject);
                                    } else {
                                        resolve();
                                    }
                                } catch (error) {
                                    reject(error);
                                }
                            });
                        }
                    })(),
                    timeoutPromise
                ]);

                if (runningTasks[id]?.doneCallback) {
                    runningTasks[id].doneCallback();
                }
            } catch (error) {
                console.error(`Task with ID: ${id} failed with error:`, error);
                if (runningTasks[id]?.failCallback) {
                    runningTasks[id].failCallback(error);
                }
            } finally {
                if (runningTasks[id]?.timeoutClear) {
                    runningTasks[id].timeoutClear();
                }
                delete runningTasks[id];
            }
        }

        function abortTask(id) {
            if (runningTasks[id]) {
                delete runningTasks[id];
                console.log(`Task with ID: ${id} has been aborted.`);
            }
        }

        function taskDone(id, callback) {
            if (runningTasks[id]) {
                runningTasks[id].doneCallback = callback;
            }
        }

        function taskFail(id, callback) {
            if (runningTasks[id]) {
                runningTasks[id].failCallback = callback;
            }
        }

        function setTimeoutForTask(id, seconds) {
            if (runningTasks[id]) {
                runningTasks[id].timeout = seconds * 1000;
            }
        }

        function setTimeoutCallback(id, callback) {
            if (runningTasks[id]) {
                runningTasks[id].timeoutCallback = callback;
            }
        }

        return {
            addTask,
            runTask,
            abortTask,
            taskDone,
            taskFail,
            setTimeoutForTask,
            setTimeoutCallback
        };
    })();

    Q.Task = function (id, ...functions) {
        if (functions.length > 0) {
            taskManager.addTask(id, ...functions);
        }
        return {
            Run: () => taskManager.runTask(id),
            Abort: () => taskManager.abortTask(id),
            Done: callback => taskManager.taskDone(id, callback),
            Fail: callback => taskManager.taskFail(id, callback),
            Timeout: (seconds) => taskManager.setTimeoutForTask(id, seconds),
            TimeoutCallback: (callback) => taskManager.setTimeoutCallback(id, callback),
        };
    };
    // #endregion
    // #region Event Manager
    Q.Ready = function (callback) {
        document.readyState === 'loading'
            ? document.addEventListener('DOMContentLoaded', callback, { once: true })
            : callback();
    };

    Q.Resize = function (callback) {
        window.addEventListener('resize', () => callback(window.innerWidth, window.innerHeight));
    };

    Q.Leaving = function (callback) {
        window.addEventListener('beforeunload', callback);
    };

    Q.prototype.on = function (events, handler, options = {}) {

        const defaultOptions = {
            capture: false,
            once: false,
            passive: false
        };

        options = { ...defaultOptions, ...options };


        return this.each(el => {
            events.split(' ').forEach(event => this.nodes[el].addEventListener(event, handler, options));
        }
        );
    };

    Q.prototype.off = function (events, handler, options = {}) {

        const defaultOptions = {
            capture: false,
            once: false,
            passive: false
        };
        options = { ...defaultOptions, ...options };

        return this.each(el => {
            events.split(' ').forEach(event => this.nodes[el].removeEventListener(event, handler, options));
        }
        );
    };

    Q.prototype.click = function () {
        return this.each(el => this.nodes[el].click());
    };

    Q.prototype.focus = function () {
        return this.each(el => this.nodes[el].focus());
    };

    Q.prototype.blur = function () {
        return this.each(el => this.nodes[el].blur());
    };
    // #endregion

    return Q;
})();