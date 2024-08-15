const Q = (() => {
    'use strict';

    function Q(selector, attributes, directProps) {
        if (!(this instanceof Q)) {
            return new Q(selector, attributes, directProps);
        }
        if (typeof selector === 'string') {
            this.elements = Array.from(this._querySelector(selector));
        } else if (selector instanceof HTMLElement || selector instanceof Node) {
            this.elements = [selector];
        } else if (attributes || directProps) {
            return Q.create(selector, attributes, directProps);
        }
    }

    Q.prototype._querySelector = function (selector) {
        switch (selector) {
            case 'document':
                return [document];
            case 'body':
                return [document.body];
            case 'head':
                return [document.head];
            default:
                return document.querySelectorAll(selector);
        }
    };

    Q.create = (tag, attributes = {}, directProps = []) => {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([attr, value]) => {
            if (attr === 'class') {
                value.split(' ').forEach(cls => element.classList.add(cls));
            } else {
                element.setAttribute(attr, value);
            }
        });
        directProps.forEach(prop => element[prop] = true);
        return new Q(element);
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
        this.elements.forEach((el, index) => callback.call(el, index, el));
        return this;
    };

    // Basic DOM Manipulation Methods

    Q.prototype.text = function (content) {
        if (content === undefined) {
            return this.elements[0]?.textContent || null;
        }
        return this.each(el => el.textContent = content);
    };

    Q.prototype.html = function (content) {
        if (content === undefined) {
            return this.elements[0]?.innerHTML || null;
        }
        return this.each(el => {
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
        return this.each(el => el.classList.add(...classList));
    };

    Q.prototype.removeClass = function (classes) {
        const classList = classes.split(' ');
        return this.each(el => el.classList.remove(...classList));
    };

    Q.prototype.toggleClass = function (className) {
        return this.each(el => el.classList.toggle(className));
    };

    Q.prototype.on = function (event, handler) {
        return this.each(el => el.addEventListener(event, handler));
    };

    Q.prototype.off = function (event, handler) {
        return this.each(el => el.removeEventListener(event, handler));
    };

    Q.prototype.val = function (value) {
        if (value === undefined) {
            return this.elements[0]?.value || null;
        }
        return this.each(el => el.value = value);
    };

    Q.prototype.data = function (key, value) {
        if (value === undefined) {
            return this.elements[0]?.dataset[key] || null;
        }
        return this.each(el => el.dataset[key] = value);
    };

    Q.prototype.removeData = function (key) {
        return this.each(el => delete el.dataset[key]);
    };

    Q.prototype.css = function (property, value) {
        if (value === undefined) {
            return getComputedStyle(this.elements[0])[property];
        }
        return this.each(el => el.style[property] = value);
    };

    Q.prototype.attr = function (attribute, value) {
        if (value === undefined) {
            return this.elements[0]?.getAttribute(attribute) || null;
        }
        return this.each(el => el.setAttribute(attribute, value));
    };

    Q.prototype.removeAttr = function (attribute) {
        return this.each(el => el.removeAttribute(attribute));
    };

    Q.prototype.append = function (...elements) {
        return this.each(el => {
            elements.forEach(child => {
                if (typeof child === 'string') {
                    el.insertAdjacentHTML('beforeend', child);
                } else if (child instanceof HTMLElement || child instanceof Q) {
                    el.appendChild(new Q(child).elements[0]);
                } else if (Array.isArray(child) || child instanceof NodeList) {
                    Array.from(child).forEach(subchild => el.appendChild(subchild));
                }
            });
        });
    };

    Q.prototype.prepend = function (...elements) {
        return this.each(el => {
            elements.reverse().forEach(child => {
                if (typeof child === 'string') {
                    el.insertAdjacentHTML('afterbegin', child);
                } else if (child instanceof HTMLElement || child instanceof Q) {
                    el.insertBefore(new Q(child).elements[0], el.firstChild);
                } else if (Array.isArray(child) || child instanceof NodeList) {
                    Array.from(child).reverse().forEach(subchild => el.insertBefore(subchild, el.firstChild));
                }
            });
        });
    };

    Q.prototype.remove = function () {
        return this.each(el => el.parentNode?.removeChild(el));
    };

    Q.prototype.empty = function () {
        return this.each(el => el.innerHTML = '');
    };

    Q.prototype.show = function () {
        return this.each(el => el.style.display = '');
    };

    Q.prototype.hide = function () {
        return this.each(el => el.style.display = 'none');
    };

    Q.prototype.fadeIn = function (duration = 400, callback) {
        return this.each(el => {
            el.style.display = '';
            el.style.transition = `opacity ${duration}ms`;
            el.style.opacity = 1;
            setTimeout(() => {
                el.style.transition = '';
                if (callback) callback();
            }, duration);
        });
    };

    Q.prototype.fadeOut = function (duration = 400, callback) {
        return this.each(el => {
            el.style.transition = `opacity ${duration}ms`;
            el.style.opacity = 0;
            setTimeout(() => {
                el.style.transition = '';
                el.style.display = 'none';
                if (callback) callback();
            }, duration);
        });
    };

    Q.prototype.fadeToggle = function (duration = 400, callback) {
        return this.each(el => {
            if (el.style.opacity === '0') {
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
            if (el.matches(selector)) return new Q(el);
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
            return Array.from(this.elements[0].parentNode.children).indexOf(this.elements[0]);
        }
        return this.each(el => {
            const parent = el.parentNode;
            const siblings = Array.from(parent.children);
            const position = siblings.indexOf(el);
            const target = siblings.splice(index, 1)[0];
            if (position < index) {
                parent.insertBefore(target, el);
            } else {
                parent.insertBefore(target, el.nextSibling);
            }
        });
    };

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

    Q.style = function (selector, styles) {
        let styleElement = document.getElementById('qlib-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'qlib-styles';
            document.head.appendChild(styleElement);
        }

        const cssText = Object.entries(styles).map(([prop, val]) => `${prop}: ${val};`).join(' ');
        const ruleIndex = Array.from(styleElement.sheet.cssRules).findIndex(rule => rule.selectorText === selector);

        if (ruleIndex === -1) {
            styleElement.sheet.insertRule(`${selector} { ${cssText} }`);
        } else {
            styleElement.sheet.deleteRule(ruleIndex);
            styleElement.sheet.insertRule(`${selector} { ${cssText} }`, ruleIndex);
        }
    };

    Q.removeStyle = function () {
        const styleElement = document.getElementById('qlib-styles');
        styleElement?.parentNode.removeChild(styleElement);
    };

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

    Q.String.prototype.replaceAll = function(stringOrRegex, replacement) {
        return this.string.replace(new RegExp(stringOrRegex, 'g'), replacement);
    };


    Q.JSON = function(json) {
        if (!(this instanceof Q.JSON)) {
            return new Q.JSON(json);
        }
        this.json = json;
    };

    Q.JSON.prototype.Parse = function(options = {modify: false, recursive: false}, callback) {
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

Q.JSON.prototype.deflate = function(level) {
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

Q.JSON.prototype.inflate = function(deflatedJson) {
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



Q.Timer = function(callback, id, options = {}) {
    const defaultOptions = {
        tick: 0,
        interval: 1000,
        interrupt: false
    };

    options = { ...defaultOptions, ...options };
    let tickCount = 0;
    let intervalId = null;

    if (!Q.Timer.activeTimers) {
        Q.Timer.activeTimers = {};
    }

    if (options.interrupt && Q.Timer.activeTimers[id]) {
        clearInterval(Q.Timer.activeTimers[id]);
    }

    intervalId = setInterval(() => {
        callback();

        tickCount++;
        if (options.tick > 0 && tickCount >= options.tick) {
            clearInterval(intervalId);
            delete Q.Timer.activeTimers[id];
        }
    }, options.interval);

    Q.Timer.activeTimers[id] = intervalId;

    return intervalId;
};

Q.Timer.stop = function(id) {
    if (Q.Timer.activeTimers && Q.Timer.activeTimers[id]) {
        clearInterval(Q.Timer.activeTimers[id]);
        delete Q.Timer.activeTimers[id];
    }
};

Q.Timer.stopAll = function() {
    if (Q.Timer.activeTimers) {
        for (let id in Q.Timer.activeTimers) {
            clearInterval(Q.Timer.activeTimers[id]);
            delete Q.Timer.activeTimers[id];
        }
    }
};





    return Q;
})();