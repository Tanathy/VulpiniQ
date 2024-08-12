const Q = (function () {
    'use strict';


    const Q = function (selector, attributes, directProps) {
        if (!(this instanceof Q)) {
            return new Q(selector, attributes, directProps);
        }
        if (typeof selector === 'string') {
            if (selector === 'document') {
                this.elements = [document];
            } else if (selector === 'body') {
                this.elements = [document.body];
            } else if (selector === 'head') {
                this.elements = [document.head];
            } else {
                this.elements = document.querySelectorAll(selector);
            }
        } else if (selector instanceof HTMLElement || selector === document || selector === document.body || selector === document.head) {
            this.elements = [selector];
        } else if (typeof selector === 'string' && (attributes || directProps)) {
            return Q.create(selector, attributes, directProps);
        }
    };

    Q.create = function (tag, attributes, directProps) {
        const element = document.createElement(tag);
        for (const attr in attributes) {
            if (attr === 'class') {
                attributes[attr].split(' ').forEach(cls => element.classList.add(cls));
            } else {
                element.setAttribute(attr, attributes[attr]);
            }
        }

        if (Array.isArray(directProps)) {
            directProps.forEach(prop => {
                element[prop] = true;
            });
        }
        return new Q(element);
    };

    Q.register = function (type, name, pluginFunction) {
        // Handle case where type and name are not provided (default to 'Q')
        if (!pluginFunction) {
            pluginFunction = name;
            name = type;
            type = 'Q';
        }

        const prototype = type === 'Q' ? Q.prototype : Q[type] && Q[type].prototype;

        if (!prototype) {
            console.error(`Unknown plugin type: ${type}`);
        }
        if (prototype[name]) {
            console.error(`Plugin ${name} already exists on ${type}.prototype`);
        }

        prototype[name] = pluginFunction;
    };

    // METHODS
    /**
     * @Name: Build
     * @Input: None
     * @Output: A container with blocks of code
     * @Function: Build your own components using a block-based approach. Each block can have its own configuration and script.
     * @Example: Q.build();
     */
    Q.build = function () {
        const scripts = document.getElementsByTagName('script');

        const builder = (data, callback) => {

            if (!data) {
                return;
            }

            let result = {};
            result.modules = {};

            let regex_BlockComments = /\/\*[\s\S]*?\*\//g;
            const Blockmatches = data.match(regex_BlockComments);
            if (Blockmatches) {
                Blockmatches.forEach(match => {

                    const regex_KeyValue = /@(\w+):\s(.+)/g;
                    let KeyValueMatches;
                    let mainKey;
                    while ((KeyValueMatches = regex_KeyValue.exec(match)) !== null) {
                        const [, key, value] = KeyValueMatches;
                        if (!mainKey) {
                            mainKey = value;
                            result.modules[mainKey] = {};
                        }
                        else {
                            result.modules[mainKey][key] = value;
                        }
                    }

                    let position = data.indexOf(match);
                    let script = data.substring(position + match.length);
                    let lines = script.split("\r\n");
                    let Brackets = 0;
                    let buildScript = [];
                    let breakLoop = false;

                    lines.forEach((line, i) => {

                        if (breakLoop) {
                            return;
                        }

                        Brackets += (line.match(/{/g) || []).length;
                        Brackets -= (line.match(/}/g) || []).length;


                        if (Brackets === 0) {
                            if (line.trim() === '') {
                                buildScript.push(line);
                            }
                            else {
                                buildScript.push(line);
                                script = buildScript.join("\r\n");
                                breakLoop = true;
                            }
                        }
                        else {
                            buildScript.push(line);
                        }
                    });
                    script = buildScript.join("\r\n");
                    result.modules[mainKey].script = script;

                    data = data.replace(match, '');
                    data = data.replace(script, '');
                }
                );
            }

            result.data = data;
            if (callback) {
                callback(result);
            }
        };

        const create = (data) => {
            let wrapper = Q('div', { class: 'container' });
            let blocks = Q('div', { class: 'container_blocks' });
            wrapper.append(blocks);

        };

        for (let script of scripts) {
            if (script.src) {
                // If the script has a 'src' attribute, it's loaded from a URL
                fetch(script.src)
                    .then(response => response.text())
                    .then(text => {
                        if (text.includes('const Q')) {
                            builder(text, (data) => {
                                create(data);
                            });
                        }
                    })
                    .catch(error => console.error(error));
            } else if (script.textContent.includes('const Q')) {
                builder(script.textContent, (data) => {
                    create(data);
                });
            }
        }
    };




    Q.JSON = function (json) {
        if (!(this instanceof Q.JSON)) {
            return new Q.JSON(json);
        }
        this.json = json;
    };

    Q.JSON.prototype.parse = function (callback, options = { modify: false, recursive: false }) {
        const { modify, recursive } = options;

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

    /**
     * @Name: JSON Keys
     * @Input: jsonData
     * @Output: Array of keys
     * @Function: Extract all keys from a JSON object and return them as an array.
     * @Example: Q.JSON(jsonData).keys();
     */
    Q.JSON.prototype.keys = function () {
        return Object.keys(this.json);
    };

    Q.prototype.each = function (callback) {
        Array.prototype.forEach.call(this.elements, (el, index) => {
            callback.call(el, index, el);
        });
        return this;
    };

    Q.JSON.prototype.deflate = function (deflateLevel = 1) {
        const jsonData = this.json;
        const map = {};
        let counter = 1;
    
        const originalSize = JSON.stringify(jsonData).length;
    
        const process = (data) => {
            if (typeof data === 'object' && data !== null) {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        // Process key
                        let newKey = key;
                        if (key.length > deflateLevel) {
                            if (!map[key]) {
                                map[key] = `[${counter}]`;
                                counter++;
                            }
                            newKey = map[key];
                            data[newKey] = data[key];
                            delete data[key];
                        }
    
                        // Process value
                        const value = data[newKey];
                        if (typeof value === 'string' && value.length > deflateLevel) {
                            if (!map[value]) {
                                map[value] = `[${counter}]`;
                                counter++;
                            }
                            data[newKey] = map[value];
                        } else if (typeof value === 'object' && value !== null) {
                            process(value);
                        }
                    }
                }
            }
        };
    
        process(jsonData);
    
        const deflatedSize = JSON.stringify(jsonData).length;
        const compressionPercentage = ((1 - deflatedSize / originalSize) * 100).toFixed(2);
    
        return {
            data: jsonData,
            map: map,
            compression: compressionPercentage
        };
    };
    
    Q.JSON.prototype.inflate = function () {
        const deflatedJson = this.json;
        const map = deflatedJson.map;
    
        const reverseMap = {};
        for (const key in map) {
            if (map.hasOwnProperty(key)) {
                reverseMap[map[key]] = key;
            }
        }
    
        const process = (data) => {
            if (typeof data === 'object' && data !== null) {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        // Process key
                        const newKey = reverseMap[key] || key;
                        const value = data[key];
                        delete data[key];
                        data[newKey] = value;
    
                        // Process value
                        if (typeof value === 'string' && reverseMap[value]) {
                            data[newKey] = reverseMap[value];
                        } else if (typeof value === 'object' && value !== null) {
                            process(value);
                        }
                    }
                }
            }
        };
    
        process(deflatedJson.data);
        delete deflatedJson.map;
        return deflatedJson.data;
    };

    /**
    * @Name: Text
    * @Input: text
    * @Output: Text content of the first element or the current object
    * @Function: Get or set the text content of the first element in the current object. If a value is provided, set the text content of all elements in the current object.
    * @Example: Q('div').text('Hello, world!');
    */
    Q.prototype.text = function (text) {
        if (text === undefined) {
            return this.elements.length > 0 ? this.elements[0].textContent : null;
        }
        return this.each(function () {
            this.textContent = text;
        });
    };

    /**
     * @Name: HTML
     * @Input: html
     * @Output: HTML content of the first element or the current object
     * @Function: Get or set the HTML content of the first element in the current object. If a value is provided, set the HTML content of all elements in the current object.
     * @Example: Q('div').html('<p>Hello, world!</p>'); or Q('div').html();
     */
    Q.prototype.html = function (html) {
        if (html === undefined) {
            return this.elements.length > 0 ? this.elements[0].innerHTML : null;
        }
        return this.each(function () {
            if (typeof html === 'string') {
                this.innerHTML = html;
            } else if (html instanceof HTMLElement) {
                this.innerHTML = '';
                this.append(html);
            } else if (html instanceof Q) {
                this.innerHTML = '';
                html.each(el => this.append(el));
            } else if (html instanceof NodeList || Array.isArray(html)) {
                this.innerHTML = '';
                Array.prototype.forEach.call(html, el => this.append(el));
            }
        });
    };

    /**
     * @Name: Add Class
     * @Input: className
     * @Output: The current object
     * @Function: Add one or more classes to all elements in the current object.
     * @Example: Q('div').addClass('class1 class2'); or Q('div').addClass(['class1', 'class2']);
     */
    Q.prototype.addClass = function (className) {
        return this.each(function () {
            if (typeof className === 'string') {
                this.classList.add(className);
            } else if (Array.isArray(className)) {
                className.forEach(cls => this.classList.add(cls));
            }
        });
    };

    /**
     * @Name: Remove Class
     * @Input: className
     * @Output: The current object
     * @Function: Remove one or more classes from all elements in the current object.
     * @Example: Q('div').removeClass('class1 class2'); or Q('div').removeClass(['class1', 'class2']);
     */
    Q.prototype.removeClass = function (className) {
        return this.each(function () {
            this.classList.remove(className);
        });
    };

    Q.prototype.toggleClass = function (className) {
        return this.each(function () {
            this.classList.toggle(className);
        });
    };

    Q.prototype.on = function (event, handler) {
        return this.each(function () {
            this.addEventListener(event, handler);
        });
    };

    Q.prototype.off = function (event, handler) {
        return this.each(function () {
            this.removeEventListener(event, handler);
        });
    };

    Q.prototype.val = function (value) {
        if (value === undefined) {
            return this.elements.length > 0 ? this.elements[0].value : null;
        }
        return this.each(function () {
            this.value = value;
        });
    };

    Q.prototype.data = function (key, value) {
        if (value === undefined) {
            return this.elements.length > 0 ? this.elements[0].dataset[key] : null;
        }
        return this.each(function () {
            this.dataset[key] = value;
        });
    };

    Q.prototype.removeData = function (key) {
        return this.each(function () {
            delete this.dataset[key];
        });
    };

    Q.prototype.width = function (value) {
        if (value === undefined) {
            return this.elements.length > 0 ? this.elements[0].clientWidth : null;
        }
        return this.each(function () {
            this.style.width = typeof value === 'number' ? `${value}px` : value;
        });
    };

    Q.prototype.css = function (property, value) {
        if (value === undefined) {
            return this.elements.length > 0 ? getComputedStyle(this.elements[0])[property] : null;
        }
        return this.each(function () {
            this.style[property] = value;
        });
    };

    Q.prototype.attr = function (attribute, value) {
        if (value === undefined) {
            return this.elements.length > 0 ? this.elements[0].getAttribute(attribute) : null;
        }
        return this.each(function () {
            this.setAttribute(attribute, value);
        });
    };

    Q.prototype.removeAttr = function (attribute) {
        return this.each(function () {
            this.removeAttribute(attribute);
        });
    };

    Q.prototype.append = function (...elements) {
        return this.each(function () {
            elements.forEach(element => {
                if (typeof element === 'string') {
                    this.insertAdjacentHTML('beforeend', element);
                } else if (element instanceof Q) {
                    element.each(el => {
                        if (el instanceof Node) {
                            this.appendChild(el);
                        }
                    });
                } else if (element instanceof HTMLElement) {
                    this.appendChild(element);
                } else if (element instanceof NodeList || Array.isArray(element)) {
                    Array.prototype.forEach.call(element, el => {
                        if (el instanceof Node) {
                            this.appendChild(el);
                        }
                    });
                }
            });
        });
    };

    Q.prototype.prepend = function (...elements) {
        return this.each(function () {
            elements.reverse().forEach(element => {
                if (typeof element === 'string') {
                    this.insertAdjacentHTML('afterbegin', element);
                } else if (element instanceof Q) {
                    element.each(el => {
                        if (el instanceof Node) {
                            this.insertBefore(el, this.firstChild);
                        }
                    });
                } else if (element instanceof HTMLElement) {
                    this.insertBefore(element, this.firstChild);
                } else if (element instanceof NodeList || Array.isArray(element)) {
                    Array.prototype.reverse.call(element);
                    Array.prototype.forEach.call(element, el => {
                        if (el instanceof Node) {
                            this.insertBefore(el, this.firstChild);
                        }
                    });
                }
            });
        });
    };

    Q.prototype.remove = function () {
        return this.each(function () {
            this.parentNode.removeChild(this);
        });
    };

    Q.prototype.empty = function () {
        return this.each(function () {
            this.innerHTML = '';
        });
    };

    Q.prototype.show = function () {
        return this.each(function () {
            this.style.display = '';
        });
    };

    Q.prototype.hide = function () {
        return this.each(function () {
            this.style.display = 'none';
        });
    };

    Q.prototype.toggle = function () {
        return this.each(function () {
            this.style.display = this.style.display === 'none' ? '' : 'none';
        });
    };

    Q.prototype.fadeIn = function (duration = 400, callback) {
        return this.each(function () {
            this.style.display = '';
            this.style.transition = `opacity ${duration}ms`;
            this.style.opacity = 1;
            setTimeout(() => {
                this.style.transition = '';
                if (typeof callback === 'function') {
                    callback();
                }
            }, duration);
        });
    };

    Q.prototype.fadeOut = function (duration = 400, callback) {
        return this.each(function () {
            this.style.transition = `opacity ${duration}ms`;
            this.style.opacity = 0;
            setTimeout(() => {
                this.style.transition = '';
                this.style.display = 'none';
                if (typeof callback === 'function') {
                    callback();
                }
            }, duration);
        });
    };

    Q.prototype.fadeToggle = function (duration = 400, callback) {
        return this.each(function () {
            if (this.style.opacity === '0') {
                this.fadeIn(duration, callback);
            } else {
                this.fadeOut(duration, callback);
            }
        });
    };

    Q.prototype.parent = function () {
        return new Q(this.elements[0].parentNode);
    };

    Q.prototype.children = function () {
        return new Q(this.elements[0].children);
    };

    Q.prototype.find = function (selector) {
        return new Q(this.elements[0].querySelectorAll(selector));
    };

    Q.prototype.closest = function (selector) {
        let el = this.elements[0];
        while (el) {
            if (el.matches(selector)) {
                return new Q(el);
            }
            el = el.parentElement;
        }
        return null;
    };

    Q.prototype.first = function () {
        return new Q(this.elements[0]);
    };

    Q.prototype.last = function () {
        return new Q(this.elements[this.elements.length - 1]);
    };

    Q.prototype.eq = function (index) {
        return new Q(this.elements[index]);
    };

    Q.prototype.index = function (index) {
        if (index === undefined) {
            return Array.prototype.indexOf.call(this.elements, this.elements[0]);
        } else {
            if (index >= 0 && index < this.elements.length) {
                this.elements.unshift(this.elements.splice(index, 1)[0]);
            }
            return this;
        }
    };

    Q.fetch = function (url, callback, options = {}) {
        const {
            method = 'GET',
            headers = {},
            body = null,
            contentType = 'application/json',
            responseType = 'json',
            credentials = 'same-origin',
            mode = 'cors',
            cache = 'default',
            redirect = 'follow',
            referrerPolicy = 'no-referrer'
        } = options;

        // Set Content-Type header if not already defined
        if (!headers['Content-Type']) {
            headers['Content-Type'] = contentType;
        }

        fetch(url, {
            method,
            headers,
            body,
            credentials,
            mode,
            cache,
            redirect,
            referrerPolicy
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                switch (responseType) {
                    case 'json':
                        return response.json();
                    case 'text':
                        return response.text();
                    case 'blob':
                        return response.blob();
                    case 'arrayBuffer':
                        return response.arrayBuffer();
                    default:
                        throw new Error('Unsupported response type');
                }
            })
            .then(data => callback(null, data))
            .catch(error => callback(error, null));
    };

    Q.socket = function (url, onMessage, onStatus, options = {}) {
        const {
            retries = 5,
            delay = 1000,
            protocols = []
        } = options;

        let socket;
        let attempts = 0;

        const connect = () => {
            if (attempts > retries) {
                onStatus && onStatus('Max retries exceeded');
                return;
            }

            socket = new WebSocket(url, protocols);

            socket.onopen = () => {
                attempts = 0;
                onStatus && onStatus('connected');
            };

            socket.onmessage = (event) => {
                onMessage && onMessage(event.data);
            };

            socket.onerror = (error) => {
                onStatus && onStatus('error', error);
            };

            socket.onclose = () => {
                attempts++;
                onStatus && onStatus('closed');
                setTimeout(connect, delay);
            };
        };

        connect();

        return {
            send: (message) => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(message);
                }
            },

            reconnect: () => {
                socket.close();
                connect();
            },

            close: () => {
                if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
                    socket.close();
                }
            }
        };
    };

    Q.style = function (selector, styles) {
        let styleElement = document.getElementById('qlib-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'qlib-styles';
            document.head.appendChild(styleElement);
        }

        const styleSheet = styleElement.sheet;
        const rules = styleSheet.cssRules || styleSheet.rules;

        let ruleIndex = -1;
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].selectorText === selector) {
                ruleIndex = i;
                break;
            }
        }

        const cssText = Object.entries(styles).map(([key, value]) => `${key}: ${value};`).join(' ');

        if (ruleIndex === -1) {
            styleSheet.insertRule(`${selector} { ${cssText} }`, rules.length);
        } else {
            styleSheet.deleteRule(ruleIndex);
            styleSheet.insertRule(`${selector} { ${cssText} }`, ruleIndex);
        }
    };

    Q.removeStyle = function () {
        const styleElement = document.getElementById('qlib-styles');
        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
        }
    };



    // String manipulation methods
    Q.String = function (string) {
        this.string = string;
    };

    Q.String.prototype.capitalize = function () {
        return this.string.charAt(0).toUpperCase() + this.string.slice(1);
    };

    Q.String.prototype.levenshtein = function (str2) {
        const str1 = this.string;
        const len1 = str1.length;
        const len2 = str2.length;
        const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

        for (let i = 0; i <= len1; i++) dp[i][0] = i;
        for (let j = 0; j <= len2; j++) dp[0][j] = j;

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1;
                }
            }
        }

        return dp[len1][len2];
    };

    Q.String.prototype.replaceAll = function (find, replace) {
        return this.string.split(find).join(replace);
    };

    Q.String.prototype.find = function (textOrRegex) {
        return this.string.match(textOrRegex);
    };

    Q.String.prototype.words = function (callback) {
        const words = this.string.match(/\b\w+\b/g);
        if (callback) {
            words.forEach(callback);
        }
        return words;
    };

    Q.String.prototype.lower = function () {
        return this.string.toLowerCase();
    };

    Q.String.prototype.upper = function () {
        return this.string.toUpperCase();
    };

    Q.String.prototype.highlight = function (array) {
        let highlighted = this.string;
        array.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            highlighted = highlighted.replace(regex, '<span class="highlight">$1</span>');
        });
        return Q(highlighted);
    };

    Q.String.prototype.unique = function () {
        const words = this.string.match(/\b\w+\b/g);
        const uniqueWords = new Set(words);
        return uniqueWords.size;
    };

    Q.String.prototype.shuffle = function (type = 'words') {
        const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
        if (type === 'words') {
            const words = this.string.split(' ');
            return shuffleArray(words).join(' ');
        } else {
            const chars = this.string.split('');
            return shuffleArray(chars).join('');
        }
    };

    Q.String.prototype.longest = function () {
        const words = this.string.match(/\b\w+\b/g);
        return words.reduce((longest, word) => word.length > longest.length ? word : longest, '');
    };

    Q.String.prototype.shortest = function () {
        const words = this.string.match(/\b\w+\b/g);
        return words.reduce((shortest, word) => word.length < shortest.length ? word : shortest, words[0]);
    };

    Q.String.prototype.asc = function () {
        const words = this.string.match(/\b\w+\b/g);
        return words.sort().join(' ');
    };

    Q.String.prototype.desc = function () {
        const words = this.string.match(/\b\w+\b/g);
        return words.sort().reverse().join(' ');
    };

    Q.String.prototype.count = function (word) {
        const words = this.string.match(/\b\w+\b/g);
        return words.filter(w => w === word).length;
    };

    Q.String.prototype.has = function (word) {
        const words = this.string.match(/\b\w+\b/g);
        return words.includes(word);
    };

    Q.String.prototype.palindrome = function () {
        const str = this.string.toLowerCase().replace(/[\W_]/g, '');
        return str === str.split('').reverse().join('');
    };

    Q.String.prototype.anagram = function (str2) {
        const str1 = this.string.toLowerCase().replace(/[\W_]/g, '');
        str2 = str2.toLowerCase().replace(/[\W_]/g, '');
        return str1.split('').sort().join('') === str2.split('').sort().join('');
    };





    // Dom Ready method
    Q.Ready = function (callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        }
    };

    Q.Resize = function (callback) {
        window.addEventListener('resize', function () {
            callback(window.innerWidth, window.innerHeight);
        });
    };

    Q.Unload = function (callback) {
        window.addEventListener('beforeunload', callback);
    };

    return Q;
})();