const Q = (() => {
    'use strict';

    function Q(selector, attributes, directProps) {
        if (!(this instanceof Q)) {
            return new Q(selector, attributes, directProps);
        }
        else if (selector instanceof HTMLElement || selector instanceof Node) {
            this.nodes = [selector];
            return;
        }
        else if (selector instanceof Q) {
            this.nodes = selector.nodes;
            return;
        }
        else if (selector instanceof NodeList) {
            this.nodes = Array.from(selector);
            return;
        }
        else if (typeof selector === 'string') {
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
            case 'document':
                return [document.documentElement];
            default:
                return document.querySelectorAll(selector);
        }
    };

    Q.prototype.each = function (callback) {
        this.nodes.forEach((el, index) => callback.call(el, index, el));
        return this;
    };

    Q.ID = function (length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    Q.UUID = function () {
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

    Q.prototype.hasClass = function (className) {
        return this.nodes[0]?.classList.contains(className) || false;
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
        if (typeof property === 'object') {
            return this.each(el => {
                for (let key in property) {
                    if (property.hasOwnProperty(key)) {
                        this.nodes[el].style[key] = property[key];
                    }
                }
            });
        } else {
            if (value === undefined) {
                return getComputedStyle(this.nodes[0])[property];
            }
            return this.each(el => this.nodes[el].style[property] = value);
        }
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

    Q.prototype.scrollWidth = function () {
        return this.nodes[0].scrollWidth;
    };

    Q.prototype.scrollHeight = function () {
        return this.nodes[0].scrollHeight;
    };

    Q.prototype.scrollTop = function (value, increment = false) {
        if (value === undefined) {
            return this.nodes[0].scrollTop;
        }
        return this.each(el => {
            const maxScrollTop = this.nodes[el].scrollHeight - this.nodes[el].clientHeight;
            if (increment) {
                this.nodes[el].scrollTop = Math.min(this.nodes[el].scrollTop + value, maxScrollTop);
            } else {
                this.nodes[el].scrollTop = Math.min(value, maxScrollTop);
            }
        });
    };

    Q.prototype.scrollLeft = function (value, increment = false) {
        if (value === undefined) {
            return this.nodes[0].scrollLeft;
        }
        return this.each(el => {
            const maxScrollLeft = this.nodes[el].scrollWidth - this.nodes[el].clientWidth;
            if (increment) {
                this.nodes[el].scrollLeft = Math.min(this.nodes[el].scrollLeft + value, maxScrollLeft);
            } else {
                this.nodes[el].scrollLeft = Math.min(value, maxScrollLeft);
            }
        });
    };

    Q.prototype.width = function (value) {
        if (value === undefined) {
            return this.nodes[0].offsetWidth;
        }
        return this.each(el => this.nodes[el].style.width = value);
    };

    Q.prototype.height = function (value) {
        if (value === undefined) {
            return this.nodes[0].offsetHeight;
        }
        return this.each(el => this.nodes[el].style.height = value);
    };

    Q.prototype.offset = function () {
        const rect = this.nodes[0].getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
    };

    Q.prototype.position = function () {
        return {
            top: this.nodes[0].offsetTop,
            left: this.nodes[0].offsetLeft
        };
    };

    Q.prototype.toggle = function () {
        return this.each(el => this.nodes[el].style.display = this.nodes[el].style.display === 'none' ? '' : 'none');
    };

    Q.prototype.is = function (selector) {
        if (selector === ':visible') {
            return this.nodes[0].offsetWidth > 0 && this.nodes[0].offsetHeight > 0;
        } else if (selector === ':hover') {
            return this.nodes[0] === document.querySelector(':hover');
        } else if (selector === ':focus') {
            return this.nodes[0] === document.activeElement;
        } else if (selector === ':blur') {
            return this.nodes[0] !== document.activeElement;
        } else {
            return this.nodes[0].matches(selector);
        }
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
        const foundNodes = this.nodes[0].querySelectorAll(selector);
        return foundNodes.length ? Q(foundNodes) : null;
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
            // Force reflow
            this.nodes[el].offsetHeight;
            this.nodes[el].style.opacity = 1;
            setTimeout(() => {
                this.nodes[el].style.transition = '';
                if (callback) callback();
            }, duration);
        });
    };

    Q.prototype.zIndex = function (value) {
        if (value === undefined) {
            let zIndex = this.nodes[0].style.zIndex;
            if (!zIndex) {
                zIndex = window.getComputedStyle(this.nodes[0]).zIndex;
            }
            return zIndex;
        }
        return this.each(el => this.nodes[el].style.zIndex = value);
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
            if (window.getComputedStyle(this.nodes[el]).opacity === '0') {
                this.fadeIn(duration, callback);
            } else {
                this.fadeOut(duration, callback);
            }
        });
    };
    
    Q.prototype.fadeTo = function (opacity, duration = 400, callback) {
        return this.each(el => {
            this.nodes[el].style.transition = `opacity ${duration}ms`;
            // Force reflow
            this.nodes[el].offsetHeight;
            this.nodes[el].style.opacity = opacity;
            setTimeout(() => {
                this.nodes[el].style.transition = '';
                if (callback) callback();
            }, duration);
        });
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