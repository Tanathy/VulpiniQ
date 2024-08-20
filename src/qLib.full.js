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
                let elem;
                switch (selector) {
                    case 'body':
                        elem = [document.body];
                    case 'head':
                        elem = [document.head];
                    case 'document':
                        elem = [document.documentElement];
                    default:
                        elem = document.querySelectorAll(selector);
                }
                this.nodes = Array.from(elem);
            }
        }
    }

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

    Q.prototype.each = function (callback) {
        // Iterates over all nodes in the Q object and executes a callback on each node.|Iteration|Q(selector).each((index, element) => console.log(index, element));
        this.nodes.forEach((el, index) => callback.call(el, index, el));
        return this;
    };

    Q.prototype.text = function (content) {
        // Gets or sets the text content of the nodes.|Content Manipulation|Q(selector).text(string);
        if (content === undefined) {
            return this.nodes[0]?.textContent || null;
        }
        return this.each(el => this.nodes[el].textContent = content);
    };

    Q.prototype.html = function (content, outer = false) {
        // Gets or sets the innerHTML or outerHTML of the nodes.|Content Manipulation|Q(selector).html(string);
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
        // Checks if the first node has a specific class.|Class Manipulation|Q(selector).hasClass(className);
        return this.nodes[0]?.classList.contains(className) || false;
    };

    Q.prototype.addClass = function (classes) {
        // Adds one or more classes to each node.|Class Manipulation|Q(selector).addClass("class1 class2");
        const classList = classes.split(' ');
        return this.each(el => this.nodes[el].classList.add(...classList));
    };

    Q.prototype.removeClass = function (classes) {
        // Removes one or more classes from each node.|Class Manipulation|Q(selector).removeClass("class1 class2");
        const classList = classes.split(' ');
        return this.each(el => this.nodes[el].classList.remove(...classList));
    };

    Q.prototype.toggleClass = function (className) {
        // Toggles a class on each node.|Class Manipulation|Q(selector).toggleClass(className);
        return this.each(el => this.nodes[el].classList.toggle(className));
    };

    Q.prototype.val = function (value) {
        // Gets or sets the value of form elements in the nodes.|Form Manipulation|Q(selector).val(value);
        if (value === undefined) {
            return this.nodes[0]?.value || null;
        }
        return this.each(el => this.nodes[el].value = value);
    };

    Q.prototype.data = function (key, value) {
        // Gets or sets data-* attributes on the nodes.|Data Manipulation|Q(selector).data(key, value);
        if (value === undefined) {
            return this.nodes[0]?.dataset[key] || null;
        }
        return this.each(el => this.nodes[el].dataset[key] = value);
    };

    Q.prototype.removeData = function (key) {
        // Removes a data-* attribute from each node.|Data Manipulation|Q(selector).removeData(key);
        return this.each(el => delete this.nodes[el].dataset[key]);
    };

    Q.prototype.css = function (property, value) {
        // Gets or sets CSS styles on the nodes. Can handle multiple styles if provided as an object.|Style Manipulation|Q(selector).css(property, value);
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
        if (typeof attribute === 'object') {
            return this.each(el => {
                for (let key in attribute) {
                    if (attribute.hasOwnProperty(key)) {
                        this.nodes[el].setAttribute(key, attribute[key]);
                    }
                }
            });
        } else {
            if (value === undefined) {
                return this.nodes[0]?.getAttribute(attribute) || null;
            }
            return this.each(el => this.nodes[el].setAttribute(attribute, value));
        }
    };

    Q.prototype.prop = function (property, value) {
        // Gets or sets a property on the nodes.|Property Manipulation|Q(selector).prop(property, value);
        if (value === undefined) {
            return this.nodes[0]?.[property] || null;
        }
        return this.each(function (index, el) {
            el[property] = value;
        });
    };

    Q.prototype.removeProp = function (property) {
        // Removes a property from each node.|Property Manipulation|Q(selector).removeProp(property);
        return this.each(el => delete this.nodes[el][property]);
    }

    Q.prototype.trigger = function (event) {
        // Triggers a specific event on each node.|Event Handling|Q(selector).trigger("click");
        return this.each(function (index, el) {
            el.dispatchEvent(new Event(event));
        });
    };

    Q.prototype.removeAttr = function (attribute) {
        // Removes an attribute from each node.|Attribute Manipulation|Q(selector).removeAttr(attribute);
        return this.each(el => this.nodes[el].removeAttribute(attribute));
    };

    Q.prototype.append = function (...nodes) {
        // Appends child nodes or HTML to each node.|DOM Manipulation|Q(selector).append("<div>Appended</div>");
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
        // Prepends child nodes or HTML to each node.|DOM Manipulation|Q(selector).prepend("<div>Prepended</div>");
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

    Q.prototype.wrap = function (wrapper) {
        // Wraps each node with the specified wrapper element.|DOM Manipulation|Q(selector).wrap("<div class="wrapper"></div>");
        return this.each(el => {
            const parent = this.nodes[el].parentNode;
            const newParent = typeof wrapper === 'string' ? document.createElement(wrapper) : wrapper;
            parent.insertBefore(newParent, this.nodes[el]);
            newParent.appendChild(this.nodes[el]);
        });
    };

    Q.prototype.wrapAll = function (wrapper) {
        // Wraps all nodes together in a single wrapper element.|DOM Manipulation|Q(selector).wrapAll("<div class="wrapper"></div>");
        return this.each(el => {
            const parent = this.nodes[el].parentNode;
            const newParent = typeof wrapper === 'string' ? document.createElement(wrapper) : wrapper;
            parent.insertBefore(newParent, this.nodes[0]);
            this.nodes.forEach(child => newParent.appendChild(child));
        });
    };

    Q.prototype.unwrap = function () {
        // Removes the parent wrapper of each node.|DOM Manipulation|Q(selector).unwrap();
        return this.each(el => {
            const parent = this.nodes[el].parentNode;
            if (parent !== document.body) {
                parent.replaceWith(...this.nodes);
            }
        });
    };

    Q.prototype.remove = function () {
        // Removes each node from the DOM.|DOM Manipulation|Q(selector).remove();
        return this.each(el => this.nodes[el].remove());
    };

    Q.prototype.scrollWidth = function () {
        // Returns the scroll width of the first node.|Dimensions|Q(selector).scrollWidth();
        return this.nodes[0].scrollWidth;
    };

    Q.prototype.scrollHeight = function () {
        // Returns the scroll height of the first node.|Dimensions|Q(selector).scrollHeight();
        return this.nodes[0].scrollHeight;
    };

    Q.prototype.scrollTop = function (value, increment = false) {
        // Gets or sets the vertical scroll position of the first node, with an option to increment.|Dimensions|Q(selector).scrollTop(value, increment);
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
        // Gets or sets the horizontal scroll position of the first node, with an option to increment.|Scroll Manipulation|Q(selector).scrollLeft(value, increment);
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
        // Gets or sets the width of the first node.|Dimensions|Q(selector).width(value);
        if (value === undefined) {
            return this.nodes[0].offsetWidth;
        }
        return this.each(el => this.nodes[el].style.width = value);
    };

    Q.prototype.height = function (value) {
        // Gets or sets the height of the first node.|Dimensions|Q(selector).height(value);
        if (value === undefined) {
            return this.nodes[0].offsetHeight;
        }
        return this.each(el => this.nodes[el].style.height = value);
    };

    Q.prototype.offset = function () {
        // Returns the top and left offset of the first node relative to the document.|Dimensions|Q(selector).offset();
        const rect = this.nodes[0].getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
    };

    Q.prototype.isExists = function () {
        // Checks if the first node exists in the DOM.|Utilities|Q(selector).isExists();
        return document.body.contains(this.nodes[0]);
    };

    Q.prototype.position = function () {
        // Returns the top and left position of the first node relative to its offset parent.|Dimension/Position|Q(selector).position();
        return {
            top: this.nodes[0].offsetTop,
            left: this.nodes[0].offsetLeft
        };
    };

    Q.prototype.toggle = function () {
        // Toggles the display of each node.|Utilities|Q(selector).toggle();
        return this.each(el => this.nodes[el].style.display = this.nodes[el].style.display === 'none' ? '' : 'none');
    };

    Q.prototype.is = function (selector) {
        // Checks if the first node matches a specific selector.|Utilities|Q(selector).is(":visible");
        if (typeof selector === 'function') {
            return selector.call(this.nodes[0], 0, this.nodes[0]);
        }

        if (typeof selector === 'string') {
            if (selector === ':visible') {
                return this.nodes[0].offsetWidth > 0 && this.nodes[0].offsetHeight > 0;
            } else if (selector === ':hidden') {
                return this.nodes[0].offsetWidth === 0 || this.nodes[0].offsetHeight === 0;
            } else if (selector === ':hover') {
                return this.nodes[0] === document.querySelector(':hover');
            } else if (selector === ':focus') {
                return this.nodes[0] === document.activeElement;
            } else if (selector === ':blur') {
                return this.nodes[0] !== document.activeElement;
            } else if (selector === ':checked') {
                return this.nodes[0].checked;
            } else if (selector === ':selected') {
                return this.nodes[0].selected;
            } else if (selector === ':disabled') {
                return this.nodes[0].disabled;
            } else if (selector === ':enabled') {
                return !this.nodes[0].disabled;
            } else {
                return this.nodes[0].matches(selector);
            }
        }

        if (selector instanceof HTMLElement || selector instanceof Node) {
            return this.nodes[0] === selector;
        }

        if (selector instanceof Q) {
            return this.nodes[0] === selector.nodes[0];
        }

        return false;
    };

    Q.prototype.empty = function () {
        // Empties the innerHTML of each node.|Content Manipulation|Q(selector).empty();
        return this.each(el => this.nodes[el].innerHTML = '');
    };

    Q.prototype.clone = function () {
        // Clones the first node.|DOM Manipulation|Q(selector).clone();
        return new Q(this.nodes[0].cloneNode(true));
    };

    Q.prototype.parent = function () {
        // Returns the parent node of the first node.|Traversal|Q(selector).parent();
        return new Q(this.nodes[0].parentNode);
    };

    Q.prototype.children = function () {
        // Returns the children of the first node.|Traversal|Q(selector).children();
        return new Q(this.nodes[0].children);
    };

    Q.prototype.find = function (selector) {
        // Finds child nodes of the first node that match a specific selector.|Traversal|Q(selector).find(".child");
        const foundNodes = this.nodes[0].querySelectorAll(selector);
        return foundNodes.length ? Q(foundNodes) : null;
    };

    Q.prototype.closest = function (selector) {
        // Returns the closest ancestor of the first node that matches a specific selector.|Traversal|Q(selector).closest(".ancestor");
        let el = this.nodes[0];
        while (el) {
            if (el.matches(selector)) return new Q(el);
            el = el.parentElement;
        }
        return null;
    };

    Q.prototype.first = function () {
        // Returns the first node.|Traversal|Q(selector).first();
        return new Q(this.nodes[0]);
    };

    Q.prototype.last = function () {
        // Returns the last node.|Traversal|Q(selector).last();
        return new Q(this.nodes[this.nodes.length - 1]);
    };

    Q.prototype.eq = function (index) {
        // Returns a specific node by index.|Traversal|Q(selector).eq(1);
        return new Q(this.nodes[index]);
    };

    Q.prototype.index = function (index) {
        // Returns the index of the first node, or the index of a specific node.|Traversal/DOM Manipulation|Q(selector).index(index);
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
    Q.prototype.show = function () {
        // Shows each node.|Display|Q(selector).show();
        return this.each(el => this.nodes[el].style.display = '');
    };

    Q.prototype.hide = function () {
        // Hides each node.|Display|Q(selector).hide();
        return this.each(el => this.nodes[el].style.display = 'none');
    };

    Q.prototype.fadeIn = function (duration = 400, callback) {
        // Fades in each node.|Display|Q(selector).fadeIn(duration, callback);
        return this.each(el => {
            this.nodes[el].style.display = '';
            this.nodes[el].style.transition = `opacity ${duration}ms`;
            this.nodes[el].offsetHeight;
            this.nodes[el].style.opacity = 1;
            setTimeout(() => {
                this.nodes[el].style.transition = '';
                if (callback) callback();
            }, duration);
        });
    };

    Q.prototype.zIndex = function (value) {
        // Gets or sets the z-index of the first node.|Display|Q(selector).zIndex(value);
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
        // Fades out each node.|Display|Q(selector).fadeOut(duration, callback);
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
        // Toggles the fade state of each node.|Display|Q(selector).fadeToggle(duration, callback);
        return this.each(el => {
            if (window.getComputedStyle(this.nodes[el]).opacity === '0') {
                this.fadeIn(duration, callback);
            } else {
                this.fadeOut(duration, callback);
            }
        });
    };

    Q.prototype.fadeTo = function (opacity, duration = 400, callback) {
        // Fades each node to a specific opacity.|Display|Q(selector).fadeTo(opacity, duration, callback);
        return this.each(el => {
            this.nodes[el].style.transition = `opacity ${duration}ms`;
            this.nodes[el].offsetHeight;
            this.nodes[el].style.opacity = opacity;
            setTimeout(() => {
                this.nodes[el].style.transition = '';
                if (callback) callback();
            }, duration);
        });
    };

    Q.prototype.animate = function (duration, properties, callback) {
        // Animates each node with specific CSS properties.|Display|Q(selector).animate(duration, { opacity: 0, left: "50px" }, callback);
        return this.each(el => {
            const element = this.nodes[el];
            const transitionProperties = Object.keys(properties).map(prop => `${prop} ${duration}ms`).join(', ');
            element.style.transition = transitionProperties;
            for (const prop in properties) {
                element.style[prop] = properties[prop];
            }
            if (typeof callback === 'function') {
                setTimeout(() => {
                    callback.call(element);
                }, duration);
            }
        }), this;
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

    Q.prototype.on = function (events, handler, options = {}) {
        // Adds an event listener to each node.|Event Handling|Q(selector).on("click", () => console.log("Clicked"));
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
        // Removes an event listener from each node.|Event Handling|Q(selector).off("click", handler);
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
        // Triggers a click event on each node.|Event Handling|Q(selector).click();
        return this.each(el => this.nodes[el].click());
    };

    Q.prototype.focus = function () {
        // Focuses on the first node.|Form Manipulation|Q(selector).focus();
        return this.each(el => this.nodes[el].focus());
    };

    Q.prototype.blur = function () {
        // Blurs the first node.|Form Manipulation|Q(selector).blur();
        return this.each(el => this.nodes[el].blur());
    };

    Q.Container = function () {



    return {
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
                    tab.addClass('q_form_disabled');
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

            wrapper.disabled = function (value, state) {
                if (data_tabs[value]) {
                    if (state) {
                        data_tabs[value].addClass('q_form_disabled');
                    } else {
                        data_tabs[value].removeClass('q_form_disabled');
                    }
                }
            };

            return wrapper;
        }
    };




};
Q.fetch = function (url, callback, options = {}) {
    const {
        method = 'GET',
        headers = {},
        body,
        contentType = 'application/json',
        responseType = 'json',
        credentials = 'same-origin',
        retries = 3,
        retryDelay = 1000, 
        timeout = 0, 
        validateResponse = (data) => data 
    } = options;

    headers['Content-Type'] = headers['Content-Type'] || contentType;

    
    const controller = new AbortController();
    const { signal } = controller;

    
    const fetchWithRetry = (attempt) => {
        
        const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

        fetch(url, { method, headers, body, credentials, signal })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                switch (responseType) {
                    case 'json': return response.json();
                    case 'text': return response.text();
                    case 'blob': return response.blob();
                    case 'arrayBuffer': return response.arrayBuffer();
                    default: throw new Error('Unsupported response type');
                }
            })
            .then(data => {
                if (timeoutId) clearTimeout(timeoutId);
                return validateResponse(data);
            })
            .then(data => callback(null, data))
            .catch(error => {
                if (timeoutId) clearTimeout(timeoutId);

                if (error.name === 'AbortError') {
                    callback(new Error('Fetch request was aborted'), null);
                } else if (attempt < retries) {
                    console.warn(`Retrying fetch (${attempt + 1}/${retries}):`, error);
                    setTimeout(() => fetchWithRetry(attempt + 1), retryDelay);
                } else {
                    callback(error, null);
                }
            });
    };

    fetchWithRetry(0);

    
    return {
        abort: () => controller.abort()
    };
};

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
Q.Store = function (key, value) {
    if (arguments.length === 2) { 
        if (value === null || value === '') { 
            localStorage.removeItem(key); 
        } else {
            localStorage.setItem(key, JSON.stringify(value)); 
        }
    } else if (arguments.length === 1) { 
        let storedValue = localStorage.getItem(key); 
        try {
            return JSON.parse(storedValue); 
        } catch (e) {
            return storedValue; 
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

    if (arguments.length === 2) { 
        if (value === null || value === '') { 
            value = ''; 
            options = { ...options, days: -1 }; 
        }
        return document.cookie = `${key}=${value}; ${_serialize(options)}`; 
    } else if (arguments.length === 1) { 
        return _parse(document.cookie)[key]; 
    }
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

Q.String.prototype.replaceAll = function (stringOrRegex, replacement) {
    return this.string.replace(new RegExp(stringOrRegex, 'g'), replacement);
};
Q.Task = (function () {
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
            timeout: 20000, 
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

    return function (id, ...functions) {
        if (functions.length > 0) {
            addTask(id, ...functions);
        }
        return {
            Run: () => runTask(id),
            Abort: () => abortTask(id),
            Done: callback => taskDone(id, callback),
            Fail: callback => taskFail(id, callback),
            Timeout: (seconds) => setTimeoutForTask(id, seconds),
            TimeoutCallback: (callback) => setTimeoutCallback(id, callback),
        };
    };
})();
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

    return Q;
})();