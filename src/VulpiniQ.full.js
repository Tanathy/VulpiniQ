const Q = (() => {
    'use strict';

    var GLOBAL = {};


    function Q(identifier, attributes, props) {
        if (!(this instanceof Q)) {
            return new Q(identifier, attributes, props);
        }
        else if (identifier instanceof HTMLElement || identifier instanceof Node) {
            this.nodes = [identifier];
            return;
        }
        else if (identifier instanceof Q) {
            this.nodes = identifier.nodes;
            return;
        }
        else if (identifier instanceof NodeList) {
            this.nodes = Array.from(identifier);
            return;
        }
        else if (typeof identifier === 'string') {
            let isCreating = !!attributes || identifier.includes('<');

            if (isCreating) {
                const fragment = document.createDocumentFragment();
                const pseudo = document.createElement('div');
                pseudo.innerHTML = identifier;
                while (pseudo.firstChild) {
                    fragment.appendChild(pseudo.firstChild);
                }
                this.nodes = Array.from(fragment.childNodes);

                if (attributes) {
                    this.nodes.forEach(el => {
                        for (const [attr, value] of Object.entries(attributes)) {
                            if (attr === 'class') {

                                if (Array.isArray(value)) {
                                    el.classList.add(...value);
                                }
                                else {

                                    el.classList.add(...value.split(/\s+/));
                                }
                            }

                            else if (attr === 'style') {
                                if (typeof value === 'object') {
                                    for (const [key, val] of Object.entries(value)) {
                                        el.style[key] = val;
                                    }
                                }
                                else {
                                    el.style.cssText = value;
                                }
                            }
                            else if (attr === 'text') {
                                el.textContent = value;
                            }

                            else if (attr === 'html') {
                                el.innerHTML = value;
                            }

                            else {
                                el.setAttribute(attr, value);
                            }
                        }
                    });
                }
                if (props) {
                    this.nodes.forEach(el => {
                        for (const prop of props) {
                            el[prop] = true;
                        }
                    });
                }
            } else {
                let elem = document.querySelectorAll(identifier);
                this.nodes = Array.from(elem);
            }
        }
    }
    // Name: addClass
// Method: Prototype
// Desc: Adds one or more classes to each node.
// Type: Class Manipulation
// Example: Q(selector).addClass("class1 class2");
Q.prototype.addClass = function (classes) {
    const classList = classes.split(' ');
    return this.each(el => this.nodes[el].classList.add(...classList));
};
// Name: animate
// Method: Prototype
// Desc: Animates each node with specific CSS properties.
// Type: Animation
// Example: Q(selector).animate(duration, { opacity: 0, left: "50px" }, callback);
Q.prototype.animate = function (duration, properties, callback) {
    return this.each(el => {
        const element = this.nodes[el];
        const transitionProperties = Object.keys(properties).map(prop => `${prop} ${duration}ms`).join(', ');
        element.style.transition = transitionProperties;
        for (const prop in properties) {
            element.style[prop] = properties[prop];
        }
        if (typeof callback === 'function') {
            setTimeout(() => {
                if (callback) callback.call(element);
            }, duration);
        }
    }), this;
};
// Name: append
// Method: Prototype
// Desc: Appends child nodes or HTML to each node.
// Type: DOM Manipulation
// Example: Q(selector).append("<div>Appended</div>");
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
// Name: attr
// Method: Prototype
// Desc: Gets or sets attributes on the nodes. Can handle multiple attributes if provided as an object.
// Type: Attribute Manipulation
// Example: Q(selector).attr(attribute, value);
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
// Name: bind
// Method: Prototype
// Desc: Adds an event listener to each node with the ability to use event delegation.
// Type: Event Handling
// Example: Q(selector).bind("click", () => console.log("Clicked"));
Q.prototype.bind = function (event, handler) {
    if (!this._eventDelegation) {
        this._eventDelegation = {};
    }

    if (!this._eventDelegation[event]) {
        document.addEventListener(event, (e) => {
            this.each(el => {
                if (this.nodes[el].contains(e.target)) {
                    handler.call(e.target, e);
                }
            });
        });
        this._eventDelegation[event] = true;
    }
    return this;
};
// Name: blur
// Method: Prototype
// Desc: Blurs the first node.
// Type: Form Manipulation
// Example: Q(selector).blur();
Q.prototype.blur = function () {
    return this.each(el => this.nodes[el].blur());
};
// Name: children
// Method: Prototype
// Desc: Returns the children of the first node.
// Type: Traversal
// Example: Q(selector).children();
Q.prototype.children = function () {
    return new Q(this.nodes[0].children);
};
// Name: click
// Method: Prototype
// Desc: Triggers a click event on each node.
// Type: Event Handling
// Example: Q(selector).click();
Q.prototype.click = function () {
    return this.each(el => this.nodes[el].click());
};
// Name: clone
// Method: Prototype
// Desc: Clones the first node.
// Type: DOM Manipulation
// Example: Q(selector).clone();
Q.prototype.clone = function () {
    return new Q(this.nodes[0].cloneNode(true));
};
// Name: closest
// Method: Prototype
// Desc: Returns the closest parent node of the first node that matches a specific selector.
// Type: Traversal
// Example: Q(selector).closest(".parent");
Q.prototype.closest = function (selector) {
    let el = this.nodes[0];
    while (el) {
        if (el.matches && el.matches(selector)) {
            return new Q(el);
        }
        el = el.parentElement;
    }
    return null;
};
// Name: css
// Method: Prototype
// Desc: Gets or sets CSS styles on the nodes. Can handle multiple styles if provided as an object.
// Type: Style Manipulation
// Example: Q(selector).css(property, value);
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
// Name: data
// Method: Prototype
// Desc: Gets or sets data-* attributes on the nodes.
// Type: Data Manipulation
// Example: Q(selector).data(key, value);
Q.prototype.data = function (key, value) {
    if (value === undefined) {
        return this.nodes[0]?.dataset[key] || null;
    }
    return this.each(el => this.nodes[el].dataset[key] = value);
};
// Name: each
// Method: Prototype
// Desc: Iterates over all nodes in the Q object and executes a callback on each node.
// Type: Iteration
// Example: Q(selector).each((index, element) => console.log(index, element));
Q.prototype.each = function (callback) {
    this.nodes.forEach((el, index) => callback.call(el, index, el));
    return this;
};
// Name: empty
// Method: Prototype
// Desc: Empties the innerHTML of each node.
// Type: Content Manipulation
// Example: Q(selector).empty();
Q.prototype.empty = function () {
    return this.each(el => this.nodes[el].innerHTML = '');
};
// Name: eq
// Method: Prototype
// Desc: Returns a specific node by index.
// Type: Traversal
// Example: Q(selector).eq(1);
Q.prototype.eq = function (index) {
    return new Q(this.nodes[index]);
};
// Name: fadeIn
// Method: Prototype
// Desc: Fades in each node.
// Type: Display
// Example: Q(selector).fadeIn(duration, callback);
Q.prototype.fadeIn = function (duration = 400, callback) {
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
// Name: fadeOut
// Method: Prototype
// Desc: Fades out each node.
// Type: Display
// Example: Q(selector).fadeOut(duration, callback);
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
// Name: fadeTo
// Method: Prototype
// Desc: Fades each node to a specific opacity.
// Type: Display
// Example: Q(selector).fadeTo(opacity, duration, callback);
Q.prototype.fadeTo = function (opacity, duration = 400, callback) {
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
// Name: fadeToggle
// Method: Prototype
// Desc: Toggles the fade state of each node.
// Type: Display
// Example: Q(selector).fadeToggle(duration, callback);
Q.prototype.fadeToggle = function (duration = 400, callback) {
    return this.each(el => {
        if (window.getComputedStyle(this.nodes[el]).opacity === '0') {
            this.fadeIn(duration, callback);
        } else {
            this.fadeOut(duration, callback);
        }
    });
};
// Name: find
// Method: Prototype
// Desc: Finds child nodes of the first node that match a specific selector.
// Type: Traversal
// Example: Q(selector).find(".child");
Q.prototype.find = function (selector) {
    const foundNodes = this.nodes[0].querySelectorAll(selector);
    return foundNodes.length ? Q(foundNodes) : null;
};
// Name: first
// Method: Prototype
// Desc: Returns the first node.
// Type: Traversal
// Example: Q(selector).first();
Q.prototype.first = function () {
    return new Q(this.nodes[0]);
};
// Name: focus
// Method: Prototype
// Desc: Focuses on the first node.
// Type: Form Manipulation
// Example: Q(selector).focus();
Q.prototype.focus = function () {
    return this.each(el => this.nodes[el].focus());
};
// Name: hasClass
// Method: Prototype
// Desc: Checks if the first node has a specific class.
// Type: Class Manipulation
// Example: Q(selector).hasClass(className);
Q.prototype.hasClass = function (className) {
    return this.nodes[0]?.classList.contains(className) || false;
};
// Name: height
// Method: Prototype
// Desc: Gets or sets the height of the first node.
// Type: Dimensions
// Example: Q(selector).height(value);
Q.prototype.height = function (value) {
    if (value === undefined) {
        return this.nodes[0].offsetHeight;
    }
    return this.each(el => this.nodes[el].style.height = value);
};
// Name: hide
// Method: Prototype
// Desc: Hides each node, optionally with a fade-out effect over a specified duration.
// Type: Display
// Example: Q(selector).hide(duration, callback);
Q.prototype.hide = function (duration = 0, callback) {
    return this.each(el => {
        const element = this.nodes[el];
        if (duration === 0) {
            element.style.display = 'none';
            if (callback) callback();
        } else {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 1;
            setTimeout(() => {
                element.style.opacity = 0;
                element.addEventListener('transitionend', function handler() {
                    element.style.display = 'none';
                    element.style.transition = '';
                    element.removeEventListener('transitionend', handler);
                    if (callback) callback();
                });
            }, 0);
        }
    });
};
// Name: html
// Method: Prototype
// Desc: Gets or sets the innerHTML of the nodes.
// Type: Content Manipulation
// Example: Q(selector).html(string);
Q.prototype.html = function (...content) {
    if (content.length === 0) {
        return this.nodes[0]?.innerHTML || null;
    }
    return this.each(el => {
        el = this.nodes[el];
        el.innerHTML = '';
        content.forEach(child => {
            if (typeof child === 'string') {
                el.insertAdjacentHTML('beforeend', child);
            } else if (child instanceof Q) {
                child.nodes.forEach(node => el.appendChild(node));
            } else if (child instanceof HTMLElement) {
                el.appendChild(child);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                Array.from(child).forEach(subchild => el.appendChild(subchild));
            }
        });
    });
};
// Name: id
// Method: Prototype
// Desc: Gets or sets the id attribute of the first node.
// Type: Attributes
// Example: Q(selector).id(); or Q(selector).id('new-id');
Q.prototype.id = function (id) {
    if (id === undefined) {
        return this.nodes[0].id;
    }

    return this.nodes[0].id = id;
};
// Name: index
// Method: Prototype
// Desc: Returns the index of the first node, or moves the node to a specific index within its parent.
// Type: Traversal
// Example: Q(selector).index(index);
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
// Name: inside
// Method: Prototype
// Desc: Checks if the first node is inside another node.
// Type: Traversal
// Example: Q(selector).inside(".parent");
Q.prototype.inside = function (selector) {
    return this.nodes[0]?.closest(selector) !== null;
};
// Name: is
// Method: Prototype
// Desc: Checks if the first node matches a specific selector.
// Type: Utilities
// Example: Q(selector).is(":visible");
Q.prototype.is = function (selector) {
    const node = this.nodes[0];

    if (!node) return false; // Handle case where there is no node

    if (typeof selector === 'function') {
        return selector.call(node, 0, node);
    }

    if (typeof selector === 'string') {
        switch (selector) {
            case ':visible':
                return node.offsetWidth > 0 && node.offsetHeight > 0;
            case ':hidden':
                return node.offsetWidth === 0 || node.offsetHeight === 0;
            case ':hover':
                return node === document.querySelector(':hover');
            case ':focus':
                return node === document.activeElement;
            case ':blur':
                return node !== document.activeElement;
            case ':checked':
                return node.checked;
            case ':selected':
                return node.selected;
            case ':disabled':
                return node.disabled;
            case ':enabled':
                return !node.disabled;
            default:
                return node.matches(selector);
        }
    }

    if (selector instanceof HTMLElement || selector instanceof Node) {
        return node === selector;
    }

    if (selector instanceof Q) {
        return node === selector.nodes[0];
    }

    return false;
};

// Name: isExists
// Method: Prototype and Static
// Desc: Checks if the first node exists in the DOM.
// Type: Utilities
// Example: Q(selector).isExists(); or Q.isExists('.ok')

// Prototype method
Q.prototype.isExists = function () {
    return document.body.contains(this.nodes[0]);
};

// Static method
Q.isExists = function (selector) {
    return document.querySelector(selector) !== null;
};
// Name: last
// Method: Prototype
// Desc: Returns the last node.
// Type: Traversal
// Example: Q(selector).last();
Q.prototype.last = function () {
    return new Q(this.nodes[this.nodes.length - 1]);
};
// Name: off
// Method: Prototype
// Desc: Removes an event listener from each node.
// Type: Event Handling
// Example: Q(selector).off("click", handler);
Q.prototype.off = function (events, handler, options = {}) {
    const defaultOptions = {
        capture: false,
        once: false,
        passive: false
    };
    options = { ...defaultOptions, ...options };

    return this.each(el => {
        events.split(' ').forEach(event => this.nodes[el].removeEventListener(event, handler, options));
    });
};
// Name: offset
// Method: Prototype
// Desc: Returns the top and left offset of the first node relative to the document.
// Type: Dimensions
// Example: Q(selector).offset();
Q.prototype.offset = function () {
    const rect = this.nodes[0].getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
};
// Name: on
// Method: Prototype
// Desc: Adds an event listener to each node.
// Type: Event Handling
// Example: Q(selector).on("click", () => console.log("Clicked"));
Q.prototype.on = function (events, handler, options = {}) {
    const defaultOptions = {
        capture: false,
        once: false,
        passive: false
    };

    options = { ...defaultOptions, ...options };

    return this.each(el => {
        events.split(' ').forEach(event => this.nodes[el].addEventListener(event, handler, options));
    });
};
// Name: parent
// Method: Prototype
// Desc: Returns the parent node of the first node.
// Type: Traversal
// Example: Q(selector).parent();
Q.prototype.parent = function () {
    return new Q(this.nodes[0].parentNode);
};
// Name: position
// Method: Prototype
// Desc: Returns the top and left position of the first node relative to its offset parent.
// Type: Dimension/Position
// Example: Q(selector).position();
Q.prototype.position = function () {
    return {
        top: this.nodes[0].offsetTop,
        left: this.nodes[0].offsetLeft
    };
};
// Name: prepend
// Method: Prototype
// Desc: Prepends child nodes or HTML to each node.
// Type: DOM Manipulation
// Example: Q(selector).prepend("<div>Prepended</div>");
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
// Name: prop
// Method: Prototype
// Desc: Gets or sets a property on the nodes.
// Type: Property Manipulation
// Example: Q(selector).prop(property, value);
Q.prototype.prop = function (property, value) {
    if (value === undefined) {
        return this.nodes[0]?.[property] || null;
    }
    return this.each(function (index, el) {
        el[property] = value;
    });
};
// Name: remove
// Method: Prototype
// Desc: Removes each node from the DOM.
// Type: DOM Manipulation
// Example: Q(selector).remove();
Q.prototype.remove = function () {
    return this.each(el => this.nodes[el].remove());
};
// Name: removeAttr
// Method: Prototype
// Desc: Removes an attribute from each node.
// Type: Attribute Manipulation
// Example: Q(selector).removeAttr(attribute);
Q.prototype.removeAttr = function (attribute) {
    return this.each(el => this.nodes[el].removeAttribute(attribute));
};
// Name: removeClass
// Method: Prototype
// Desc: Removes one or more classes from each node.
// Type: Class Manipulation
// Example: Q(selector).removeClass("class1 class2");
Q.prototype.removeClass = function (classes) {
    const classList = classes.split(' ');
    return this.each(el => this.nodes[el].classList.remove(...classList));
};
// Name: removeData
// Method: Prototype
// Desc: Removes a data-* attribute from each node.
// Type: Data Manipulation
// Example: Q(selector).removeData(key);
Q.prototype.removeData = function (key) {
    return this.each(el => delete this.nodes[el].dataset[key]);
};
// Name: removeProp
// Method: Prototype
// Desc: Removes a property from each node.
// Type: Property Manipulation
// Example: Q(selector).removeProp(property);
Q.prototype.removeProp = function (property) {
    return this.each(el => delete this.nodes[el][property]);
};
// Name: removeTransition
// Method: Prototype
// Desc: Removes the transition from each node.
// Type: Display
// Example: Q(selector).removeTransition();
Q.prototype.removeTransition = function () {
    return this.each(el => this.nodes[el].style.transition = '');
};
// Name: scrollHeight
// Method: Prototype
// Desc: Returns the scroll height of the first node.
// Type: Scroll Manipulation
// Example: Q(selector).scrollHeight();
Q.prototype.scrollHeight = function () {
    return this.nodes[0].scrollHeight;
};
// Name: scrollLeft
// Method: Prototype
// Desc: Gets or sets the horizontal scroll position of the first node, with an option to increment.
// Type: Scroll Manipulation
// Example: Q(selector).scrollLeft(value, increment);
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
// Name: scrollTop
// Method: Prototype
// Desc: Gets or sets the vertical scroll position of the first node, with an option to increment.
// Type: Scroll Manipulation
// Example: Q(selector).scrollTop(value, increment);
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
// Name: scrollWidth
// Method: Prototype
// Desc: Returns the scroll width of the first node.
// Type: Dimensions
// Example: Q(selector).scrollWidth();
Q.prototype.scrollWidth = function () {
    return this.nodes[0].scrollWidth;
};
// Name: show
// Method: Prototype
// Desc: Shows each node, optionally with a fade-in effect over a specified duration.
// Type: Display
// Example: Q(selector).show(duration, callback);
Q.prototype.show = function (duration = 0, callback) {
    return this.each(el => {
        const element = this.nodes[el];
        if (duration === 0) {
            element.style.display = '';
            if (callback) callback();
        } else {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 0;
            element.style.display = '';
            setTimeout(() => {
                element.style.opacity = 1;
                element.addEventListener('transitionend', function handler() {
                    element.style.transition = '';
                    element.removeEventListener('transitionend', handler);
                    if (callback) callback();
                });
            }, 0);
        }
    });
};
// Name: size
// Method: Prototype
// Desc: Returns the width and height of the first node.
// Type: Dimensions
// Example: Q(selector).size();
Q.prototype.size = function () {
    return {
        width: this.nodes[0].offsetWidth,
        height: this.nodes[0].offsetHeight
    };
};
// Name: text
// Method: Prototype
// Desc: Gets or sets the text content of the nodes.
// Type: Content Manipulation
// Example: Q(selector).text(string);
Q.prototype.text = function (content) {
    if (content === undefined) {
        return this.nodes[0]?.textContent || null;
    }
    return this.each(el => this.nodes[el].textContent = content);
};
// Name: toggle
// Method: Prototype
// Desc: Toggles the display of each node.
// Type: Utilities
// Example: Q(selector).toggle();
Q.prototype.toggle = function () {
    return this.each(el => this.nodes[el].style.display = this.nodes[el].style.display === 'none' ? '' : 'none');
};
// Name: toggleClass
// Method: Prototype
// Desc: Toggles a class on each node.
// Type: Class Manipulation
// Example: Q(selector).toggleClass(className);
Q.prototype.toggleClass = function (className) {
    return this.each(el => this.nodes[el].classList.toggle(className));
};
// Name: trigger
// Method: Prototype
// Desc: Triggers a specific event on each node.
// Type: Event Handling
// Example: Q(selector).trigger("click");
Q.prototype.trigger = function (event) {
    return this.each(function (index, el) {
        el.dispatchEvent(new Event(event));
    });
};
// Name: unwrap
// Method: Prototype
// Desc: Removes the parent wrapper of each node.
// Type: DOM Manipulation
// Example: Q(selector).unwrap();
Q.prototype.unwrap = function () {
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        if (parent !== document.body) {
            parent.replaceWith(...this.nodes);
        }
    });
};
// Name: val
// Method: Prototype
// Desc: Gets or sets the value of form elements in the nodes.
// Type: Form Manipulation
// Example: Q(selector).val(value);
Q.prototype.val = function (value) {
    if (value === undefined) {
        return this.nodes[0]?.value || null;
    }
    return this.each(el => this.nodes[el].value = value);
};
// Name: Wait
// Method: Prototype
// Desc: Returns a promise that resolves after a given time. Useful for delaying actions.
// Type: Utility
// Example: Q('.text').wait(1000).text('Hello, World!');
Q.prototype.wait = function (ms) {
    // Store the current instance of Q
    const qInstance = this;

    // Return a new promise that resolves after the wait period
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(qInstance); // Resolve with the current instance to keep chaining
        }, ms);
    });
};
// Name: walk
// Method: Prototype
// Desc: Walks through all nodes in the Q object and executes a callback on each node, passing the current node as a Q object or raw element based on the boolean parameter.
// Type: Iteration
// Example: Q(selector).walk((node) => console.log(node), true); // Passes Q object
Q.prototype.walk = function (callback, useQObject = true) {
    this.nodes.forEach((el, index) => {
        const node = useQObject ? Q(el) : el;
        callback.call(el, node, index);
    });
    return this;
};
// Name: width
// Method: Prototype
// Desc: Gets or sets the width of the first node.
// Type: Dimensions
// Example: Q(selector).width(value);
Q.prototype.width = function (value) {
    if (value === undefined) {
        return this.nodes[0].offsetWidth;
    }
    return this.each(el => this.nodes[el].style.width = value);
};
// Name: wrap
// Method: Prototype
// Desc: Wraps each node with the specified wrapper element.
// Type: DOM Manipulation
// Example: Q(selector).wrap("<div class='wrapper'></div>");
Q.prototype.wrap = function (wrapper) {
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        const newParent = typeof wrapper === 'string' ? document.createElement(wrapper) : wrapper;
        parent.insertBefore(newParent, this.nodes[el]);
        newParent.appendChild(this.nodes[el]);
    });
};
// Name: wrapAll
// Method: Prototype
// Desc: Wraps all nodes together in a single wrapper element.
// Type: DOM Manipulation
// Example: Q(selector).wrapAll("<div class='wrapper'></div>");
Q.prototype.wrapAll = function (wrapper) {
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        const newParent = typeof wrapper === 'string' ? document.createElement(wrapper) : wrapper;
        parent.insertBefore(newParent, this.nodes[0]);
        this.nodes.forEach(child => newParent.appendChild(child));
    });
};
// Name: zIndex
// Method: Prototype
// Desc: Gets or sets the z-index of the first node.
// Type: Display
// Example: Q(selector).zIndex(value);
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
// Name: ColorBrightness
// Method: Static
// Desc: Adjusts the brightness of a color by a percentage.
// Type: Color
// Example: Q.ColorBrightness('#000000', 50); // #7f7f7f (black +50%)
Q.ColorBrightness = function (color, percent) {
    let r, g, b, a = 1;
    let hex = false;

    // Early return for unsupported color formats
    if (!color.startsWith('#') && !color.startsWith('rgb')) {
        throw new Error('Unsupported color format');
    }

    // Parse hex color
    if (color.startsWith('#')) {
        color = color.replace(/^#/, '');
        if (color.length === 3) {
            r = parseInt(color[0] + color[0], 16);
            g = parseInt(color[1] + color[1], 16);
            b = parseInt(color[2] + color[2], 16);
        }
        if (color.length === 6) {
            r = parseInt(color.substring(0, 2), 16);
            g = parseInt(color.substring(2, 4), 16);
            b = parseInt(color.substring(4, 6), 16);
        }
        hex = true;
    }

    // Parse rgb/rgba color
    if (color.startsWith('rgb')) {
        const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)/);
        if (rgba) {
            r = parseInt(rgba[1]);
            g = parseInt(rgba[2]);
            b = parseInt(rgba[3]);
            if (rgba[4]) {
                a = parseFloat(rgba[4]);
            }
        }
    }

    // Adjust each color component
    r = Math.min(255, Math.max(0, r + (r * percent / 100)));
    g = Math.min(255, Math.max(0, g + (g * percent / 100)));
    b = Math.min(255, Math.max(0, b + (b * percent / 100)));

    // Convert back to the appropriate format and return
    if (hex) {
        return '#' +
            ('0' + Math.round(r).toString(16)).slice(-2) +
            ('0' + Math.round(g).toString(16)).slice(-2) +
            ('0' + Math.round(b).toString(16)).slice(-2);
    } else if (color.startsWith('rgb')) {
        if (a === 1) {
            return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        } else {
            return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
        }
    }
}

// Name: Debounce
// Method: Static
// Desc: Debounces a function to only be called after a certain amount of time has passed since the last call avoiding multiple calls in a short period of time.
// Type: Event Handling
// Example: Q.Debounce('myFunction', 500, myFunction);
Q.Debounce = function (id, time, callback) {
    GLOBAL = GLOBAL || {};
    GLOBAL.Flood = GLOBAL.Flood || {};
    if (GLOBAL.Flood[id]) {
        clearTimeout(GLOBAL.Flood[id]);
    }
    GLOBAL.Flood[id] = time ? setTimeout(callback, time) : callback();
};
// Name: Done
// Method: Static
// Desc: Registers callbacks to be executed when the window has fully loaded.
// Type: Event Handling
// Example: Q.Done(() => { console.log('Window has fully loaded'); });
Q.Done = (function () {
    const callbacks = [];
    window.addEventListener('load', () => {
        callbacks.forEach(callback => callback());
    });
    return function (callback) {
        callbacks.push(callback);
    };
})();
// Name: HSL2RGB
// Method: Static
// Desc: Converts HSL to RGB.
// Type: Color
// Example: Q.HSL2RGB(0, 0, 1); // [255, 255, 255]
Q.HSL2RGB = function (h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        let hue2rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
};
// Name: ID
// Method: Static
// Desc: Generates a random hexadecimal ID with a specified length and optional prefix.
// Type: Utility
// Example: Q.ID(8, 'user-'); // user-1a2b3c4d
Q.ID = function (length = 8, prefix = '') {
    return prefix + [...Array(length)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
};
// Name: isDarkColor
// Method: Static
// Desc: Determines if a color is dark or light.
// Type: Color
// Example: Q.isDarkColor('#000000'); // true (black)
Q.isDarkColor = function (color, margin = 20, threshold = 100) {
    let r, g, b;

    // Parse hex color
    if (color.startsWith('#')) {
        color = color.replace(/^#/, '');
        if (color.length === 3) {
            r = parseInt(color[0] + color[0], 16);
            g = parseInt(color[1] + color[1], 16);
            b = parseInt(color[2] + color[2], 16);
        } else if (color.length === 6) {
            r = parseInt(color.substring(0, 2), 16);
            g = parseInt(color.substring(2, 4), 16);
            b = parseInt(color.substring(4, 6), 16);
        } else {
            throw new Error('Invalid hex color format');
        }
    }

    // Parse rgb/rgba color
    else if (color.startsWith('rgb')) {
        const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)/);
        if (rgba) {
            r = parseInt(rgba[1]);
            g = parseInt(rgba[2]);
            b = parseInt(rgba[3]);
        } else {
            throw new Error('Invalid rgb/rgba color format');
        }
    } else {
        throw new Error('Unsupported color format');
    }

    // Calculate HSP value
    let hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Adjust brightness by ±20
    hsp += margin;

    // Determine if the color is dark
    return hsp < threshold;
}
// Name: Leaving
// Method: Static
// Desc: Registers callbacks to be executed when the window is about to be unloaded.
// Type: Event Handling
// Example: Q.Leaving((event) => { console.log('Window is about to be unloaded'); });
Q.Leaving = (function () {
    const callbacks = [];
    window.addEventListener('beforeunload', (event) => {
        callbacks.forEach(callback => callback(event));
    });
    return function (callback) {
        callbacks.push(callback);
    };
})();
// Name: Ready
// Method: Static
// Desc: Registers callbacks to be executed when the DOM is fully loaded.
// Type: Event Handling
// Example: Q.Ready(() => { console.log('DOM is ready'); });
Q.Ready = (function () {
    const callbacks = [];
    document.addEventListener('DOMContentLoaded', () => {
        callbacks.forEach(callback => callback());
    }, { once: true });

    return function (callback) {
        if (document.readyState === 'loading') {
            callbacks.push(callback);
        } else {
            callback();
        }
    };
})();
// Name: Resize
// Method: Static
// Desc: Registers callbacks to be executed on window resize, providing the new width and height.
// Type: Event Handling
// Example: Q.Resize((width, height) => { console.log(`Width: ${width}, Height: ${height}`); });
Q.Resize = (function () {
    const callbacks = [];
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        callbacks.forEach(callback => callback(width, height));
    });
    return function (callback) {
        callbacks.push(callback);
    };
})();
// Name: RGB2HSL
// Method: Static
// Desc: Converts RGB to HSL.
// Type: Color
// Example: Q.RGB2HSL(255, 255, 255); // [0, 0, 1]
Q.RGB2HSL = function (r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
};
    // Name: Container
// Method: Plugin
// Desc: Useful to create tabbed containers.
// Type: Plugin
// Example: var containers = Q.Container();
// Dependencies: Style, addClass, removeClass, on, append, each, find, scrollTop, scrollLeft
Q.Container = function (options = {}) {

    let Icon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' container_icon');
        return iconElement;
    };

    let classes = Q.style(`
        :root {
  	--svg_arrow-down: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 100.93685,31.353867 C 82.480099,48.598492 67.319803,62.707709 67.247301,62.707709 c -0.0725,0 -15.232809,-14.109215 -33.689561,-31.353842 L 3.5365448e-8,6.6845858e-7 H 67.247301 134.4946 Z"/></svg>');
	--svg_arrow-left: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="M 31.353844,100.93685 C 14.109219,82.480099 1.6018623e-6,67.319803 1.6018623e-6,67.247301 1.6018623e-6,67.174801 14.109217,52.014492 31.353844,33.55774 L 62.70771,0 V 67.247301 134.4946 Z"/></svg>');
	--svg_arrow-right: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="m 31.353868,33.55775 c 17.244625,18.456749 31.353842,33.617045 31.353842,33.689547 0,0.0725 -14.109215,15.232809 -31.353842,33.689563 L 1.6018623e-6,134.4946 V 67.247297 0 Z"/></svg>');
	--svg_arrow-up: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 33.55775,31.353843 C 52.014499,14.109218 67.174795,6.6845858e-7 67.247297,6.6845858e-7 67.319797,6.6845858e-7 82.480106,14.109216 100.93686,31.353843 L 134.4946,62.707709 H 67.247297 3.5365448e-8 Z"/></svg>');
        }
 
 .svg_arrow-down {
     -webkit-mask: var(--svg_arrow-down) no-repeat center;
     mask: var(--svg_arrow-down) no-repeat center;
     background-color: currentColor;
     -webkit-mask-size: contain;
     mask-size: contain;
 }
 
 .svg_arrow-left {
     -webkit-mask: var(--svg_arrow-left) no-repeat center;
     mask: var(--svg_arrow-left) no-repeat center;
     background-color: currentColor;
     -webkit-mask-size: contain;
     mask-size: contain;
 }
 
 .svg_arrow-right {
     -webkit-mask: var(--svg_arrow-right) no-repeat center;
     mask: var(--svg_arrow-right) no-repeat center;
     background-color: currentColor;
     -webkit-mask-size: contain;
     mask-size: contain;
 }
 
 .svg_arrow-up {
     -webkit-mask: var(--svg_arrow-up) no-repeat center;
     mask: var(--svg_arrow-up) no-repeat center;
     background-color: currentColor;
     -webkit-mask-size: contain;
     mask-size: contain;
 }
 
         .container_icon {
             width: 100%;
             height: 100%;
             color: #777; /* Default color */
             pointer-events: none;
             z-index: 1;
         }

          .tab_navigation_buttons {
         box-sizing: border-box;
            width: 20px;
            background-color: #333;
            display: flex;
            justify-content: center;
            padding: 4px;
        }
        
        .tab_navigation_buttons_vertical {
            width: auto;
            height: 20px;
        }
        
        .tab_navigation_buttons:hover {
            background-color: #555;
        }
        
        .tab_container {
            width: 100%;
            height: 300px;
        }
        
        .tab_container_vertical {
        display: flex;
                }
        
        .tab_navigation_header {
        
            background-color: #333;
            display: flex;
        }
        
        .tab_navigation_header_vertical {
            flex-direction: column;
                width: auto;
        }
        
        .tab_navigation_tabs {
        user-select: none;
            display: flex;
            flex-direction: row;
            width: 100%;
            overflow: hidden;
        }
        
        .tab_navigation_tabs_vertical {
            flex-direction: column;
        }
        
        .tab_active {
            background-color: #555;
            color: #fff;
        }
        
        .tab {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: default;
            padding: 5px 25px;
        }
        
        .tab_disabled {
            background-color: #333;
            color: #555;
        }
 `,
        {
            'tab_navigation_buttons': 'tab_navigation_buttons',
            'tab_navigation_buttons_vertical': 'tab_navigation_buttons_vertical',
            'tab_container': 'tab_container',
            'tab_container_vertical': 'tab_container_vertical',
            'tab_navigation_header': 'tab_navigation_header',
            'tab_navigation_header_vertical': 'tab_navigation_header_vertical',
            'tab_navigation_tabs': 'tab_navigation_tabs',
            'tab_navigation_tabs_vertical': 'tab_navigation_tabs_vertical',
            'tab_active': 'tab_active',
            'tab': 'tab',
            'tab_disabled': 'tab_disabled'
        });

    return {
        Tab: function (data, horizontal = true) {
            let wrapper = Q('<div>', { class: classes.tab_container });
            let tabs_wrapper = Q('<div>', { class: classes.tab_navigation_header });
            let tabs_nav_left = Q('<div>', { class: classes.tab_navigation_buttons });
            let tabs_nav_right = Q('<div>', { class: classes.tab_navigation_buttons });
            let tabs = Q('<div>', { class: classes.tab_navigation_tabs });

            tabs_wrapper.append(tabs_nav_left, tabs, tabs_nav_right);
            
            let content = Q('<div>');
            wrapper.append(tabs_wrapper, content);
            if (!horizontal) {
                wrapper.addClass(classes.tab_container_vertical);
                tabs.addClass(classes.tab_navigation_tabs_vertical);
                tabs_wrapper.addClass(classes.tab_navigation_header_vertical);
                tabs_nav_left.addClass(classes.tab_navigation_buttons_vertical);
                tabs_nav_right.addClass(classes.tab_navigation_buttons_vertical);
                tabs_nav_left.append(Icon('arrow-up'));
                tabs_nav_right.append(Icon('arrow-down'));
            }
            else {
                tabs_nav_left.append(Icon('arrow-left'));
                tabs_nav_right.append(Icon('arrow-right'));
            }

            let data_tabs = {};
            let data_contents = {};

            data.forEach((item) => {
                const tab = Q('<div>', { class: classes.tab, 'data-value': item.value }).text(item.title);
                if (item.disabled) {
                    tab.addClass(classes.tab_disabled);
                }

                data_tabs[item.value] = tab;
                data_contents[item.value] = item.content;

                tab.on('click', function () {

                    if (item.disabled) {
                        return;
                    }

                    let foundTabs = tabs.find('.' + classes.tab_active);

                    if (foundTabs) {
                        foundTabs.removeClass(classes.tab_active);
                    }

                    tab.addClass(classes.tab_active);
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
                        data_tabs[value].addClass(classes.tab_disabled);
                    } else {
                        data_tabs[value].removeClass(classes.tab_disabled);
                    }
                }
            };

            return wrapper;
        }
    };




};
// Name: Cookie
// Method: Plugin
// Desc: Provides methods to store and retrieve data from the browser cookies.
// Type: Plugin
// Example: Q.Cookie('key', 'value to store'); Q.Cookie('key'); // returns 'value to store'
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
// Name: Fetch
// Method: Plugin
// Desc: Fetches data from a URL and returns it to a callback function. Supports retries, timeouts, and custom response validation.
// Type: Plugin
// Example: Q.fetch('https://api.example.com/data', (error, data) => console.log(error, data));
Q.Fetch = function (url, callback, options = {}) {
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
    }

    let classes = Q.style(`
           :root {
               --svg_window-close: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 2.8176856,98.903421 -4.0360052e-7,96.085741 22.611458,73.473146 45.222917,50.860554 22.611458,28.247962 -4.0360052e-7,5.6353711 2.8176856,2.8176851 5.6353716,-9.1835591e-7 28.247963,22.611458 50.860555,45.222916 73.473147,22.611458 96.085743,-9.1835591e-7 98.903423,2.8176851 101.72111,5.6353711 79.109651,28.247962 56.498193,50.860554 79.109651,73.473146 101.72111,96.085741 98.903423,98.903421 96.085743,101.72111 73.473147,79.109651 50.860555,56.498192 28.247963,79.109651 5.6353716,101.72111 Z"/></svg>');
               --svg_window-full: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 H 50.860555 84.417403 V 50.860554 84.417401 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z"/></svg>');
               --svg_window-minimize: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 0.5252846,83.893071 V 79.698469 H 50.860555 101.19582 v 4.194602 4.19461 H 50.860555 0.5252846 Z"/></svg>');
               --svg_window-windowed: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 h 8.389212 8.389212 V 8.9144961 0.52528408 H 67.638978 101.19582 V 34.082131 67.638977 h -8.389207 -8.38921 v 8.389212 8.389212 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z M 92.806613,34.082131 V 8.9144961 H 67.638978 42.471343 v 4.1946059 4.194606 h 20.973029 20.973031 v 20.973029 20.973029 h 4.1946 4.19461 z"/></svg>');
           }

           .svg_window-close {
               -webkit-mask: var(--svg_window-close) no-repeat center;
               mask: var(--svg_window-close) no-repeat center;
               background-color: currentColor;
               -webkit-mask-size: contain;
               mask-size: contain;
           }

           .svg_window-full {
               -webkit-mask: var(--svg_window-full) no-repeat center;
               mask: var(--svg_window-full) no-repeat center;
               background-color: currentColor;
               -webkit-mask-size: contain;
               mask-size: contain;
           }

           .svg_window-minimize {
               -webkit-mask: var(--svg_window-minimize) no-repeat center;
               mask: var(--svg_window-minimize) no-repeat center;
               background-color: currentColor;
               -webkit-mask-size: contain;
               mask-size: contain;
           }

           .svg_window-windowed {
               -webkit-mask: var(--svg_window-windowed) no-repeat center;
               mask: var(--svg_window-windowed) no-repeat center;
               background-color: currentColor;
               -webkit-mask-size: contain;
               mask-size: contain;
           }

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
            let changeCallback = null; // Store the callback function here
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
                let baseDate = new Date(2021, 0, 4); // A Monday (we will adjust later)
                const options = { weekday: short ? 'short' : 'long' };

                let firstDayOfWeek = getFirstDayOfWeek(); // Get the locale's first day of the week

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
// Name: Image
// Method: Plugin
// Desc: Useful to manipulate images.
// Type: Plugin
// Example: var image = Q.Image();
// Dependencies: RGB2HSL, HSL2RGB

Q.Image = function (options) {
    let Canvas = Q('<canvas>')
    let canvas_node = Canvas.nodes[0];

    let defaultOptions = {
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        size: 'auto',
        quality: 1
    }

    options = Object.assign(defaultOptions, options);


    Canvas.Load = function (src, callback) {
        //check if the src is base64, img or url
        let img = new Image();
        img.src = src;
        img.onload = function () {
            canvas_node.width = img.width;
            canvas_node.height = img.height;
            canvas_node.getContext('2d').drawImage(img, 0, 0);
            if (callback) callback();
        };
    }

    Canvas.Get = function (format = options.format, quality = options.quality) {
        if (format === 'jpeg' || format === 'webp') {
            return canvas_node.toDataURL('image/' + format, quality);
        } else {
            return canvas_node.toDataURL('image/' + format);
        }
    }

    Canvas.Save = function (filename, format = options.format, quality = options.quality) {
        let href = Canvas.Get(format, quality);
        let a = Q('<a>', { download: filename, href: href });
        a.click();
    }

    Canvas.Clear = function (fill = options.fill) {
        let ctx = canvas_node.getContext('2d');
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas_node.width, canvas_node.height);
    }

    Canvas.Resize = function (width, height, size = options.size, keepDimensions = false) {
        options.width = width;
        options.height = height;
        options.size = size;

        console.log(keepDimensions);

        let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
        let ctx = temp.getContext('2d');
        let ratio = 1;

        let canvasWidth = canvas_node.width;
        let canvasHeight = canvas_node.height;

        if (size === 'contain') {
            if (keepDimensions) {
                // Keep the dimensions but scale the image to fit within the specified dimensions
                let widthRatio = width / canvasWidth;
                let heightRatio = height / canvasHeight;
                ratio = Math.min(widthRatio, heightRatio);

                // Scale the image to fit within the specified dimensions
                let newWidth = canvasWidth * ratio;
                let newHeight = canvasHeight * ratio;
                let xOffset = (width - newWidth) / 2;
                let yOffset = (height - newHeight) / 2;

                // Draw the image onto the temporary canvas with padding if necessary
                ctx.fillStyle = options.fill;
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(canvas_node, xOffset, yOffset, newWidth, newHeight);
            } else {
                // Scale the image to fit within the specified dimensions
                let widthRatio = width / canvasWidth;
                let heightRatio = height / canvasHeight;
                ratio = Math.min(widthRatio, heightRatio);
                let newWidth = canvasWidth * ratio;
                let newHeight = canvasHeight * ratio;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
            }
        } else if (size === 'cover') {
            // Scale the image to cover the specified dimensions
            let widthRatio = width / canvasWidth;
            let heightRatio = height / canvasHeight;
            ratio = Math.max(widthRatio, heightRatio);

            let newWidth = canvasWidth * ratio;
            let newHeight = canvasHeight * ratio;

            let xOffset = (newWidth - width) / 2;
            let yOffset = (newHeight - height) / 2;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(canvas_node, -xOffset, -yOffset, newWidth, newHeight);
        } else if (size === 'auto') {
            ratio = Math.min(width / canvasWidth, height / canvasHeight);
            let newWidth = canvasWidth * ratio;
            let newHeight = canvasHeight * ratio;

            ctx.fillStyle = options.fill;
            ctx.fillRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
        }

        canvas_node.width = width;
        canvas_node.height = height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }

    // Canvas.Resize = function (width, height, size = options.size, keepDimensions = false) {
    //     options.width = width;
    //     options.height = height;
    //     options.size = size;

    //     console.log(keepDimensions);

    //     let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
    //     let ctx = temp.getContext('2d');
    //     let ratio = 1;

    //     let canvasWidth = canvas_node.width;
    //     let canvasHeight = canvas_node.height;
    //     let xOffset = 0;
    //     let yOffset = 0;
    //     let newWidth = 0;
    //     let newHeight = 0;
    //     let widthRatio = width / canvasWidth;
    //     let heightRatio = height / canvasHeight;

    //     if (size === 'contain') {
    //         if (keepDimensions) {
    //             ratio = Math.min(widthRatio, heightRatio);

    //             newWidth = canvasWidth * ratio;
    //             newHeight = canvasHeight * ratio;
    //             xOffset = (width - newWidth) / 2;
    //             yOffset = (height - newHeight) / 2;

    //             ctx.fillStyle = options.fill;
    //             ctx.fillRect(0, 0, width, height);
    //             ctx.drawImage(canvas_node, xOffset, yOffset, newWidth, newHeight);
    //         } else {
    //             ratio = Math.min(widthRatio, heightRatio);
    //         }
    //     } else if (size === 'cover') {
    //         ratio = Math.max(widthRatio, heightRatio);
    //          xOffset = (newWidth - width) / 2;
    //          yOffset = (newHeight - height) / 2;
    //     } else if (size === 'auto') {
    //         ratio = Math.min(width / canvasWidth, height / canvasHeight);
    //         ctx.fillStyle = options.fill;
    //         ctx.fillRect(0, 0, width, height);
    //     }

    //     newWidth = canvasWidth * ratio;
    //     newHeight = canvasHeight * ratio;
    //     ctx.imageSmoothingEnabled = true;
    //     ctx.imageSmoothingQuality = 'high';
    //     ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
    //     canvas_node.width = width;
    //     canvas_node.height = height;
    //     canvas_node.getContext('2d').drawImage(temp, 0, 0);
    // }


    Canvas.Crop = function (x, y, width, height) {
        let temp = Q('<canvas>', { width: width, height: height });
        temp.getContext('2d').drawImage(canvas_node, x, y, width, height, 0, 0, width, height);
        canvas_node.width = width;
        canvas_node.height = height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }

    Canvas.Rotate = function (degrees) {
        let temp = Q('<canvas>', { width: canvas_node.height, height: canvas_node.width });
        let ctx = temp.getContext('2d');
        ctx.translate(canvas_node.height / 2, canvas_node.width / 2);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(canvas_node, -canvas_node.width / 2, -canvas_node.height / 2);
        canvas_node.width = temp.width;
        canvas_node.height = temp.height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }

    Canvas.Flip = function (direction = 'horizontal') //horizontal, vertical
    {
        let temp = Q('<canvas>', { width: canvas_node.width, height: canvas_node.height });
        let ctx = temp.getContext('2d');
        ctx.translate(canvas_node.width, 0);
        ctx.scale(direction == 'horizontal' ? -1 : 1, direction == 'vertical' ? -1 : 1);
        ctx.drawImage(canvas_node, 0, 0);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }

    Canvas.Grayscale = function () {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            pixels[i] = avg;
            pixels[i + 1] = avg;
            pixels[i + 2] = avg;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Brightness = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] += value;
            pixels[i + 1] += value;
            pixels[i + 2] += value;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Contrast = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let factor = (259 * (value + 255)) / (255 * (259 - value));
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = factor * (pixels[i] - 128) + 128;
            pixels[i + 1] = factor * (pixels[i + 1] - 128) + 128;
            pixels[i + 2] = factor * (pixels[i + 2] - 128) + 128;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Vivid = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = Math.min(255, pixels[i] * value);
            pixels[i + 1] = Math.min(255, pixels[i + 1] * value);
            pixels[i + 2] = Math.min(255, pixels[i + 2] * value);
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Hue = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let hsl = Q.RGB2HSL(r, g, b);
            hsl[0] += value;
            let rgb = Q.HSL2RGB(hsl[0], hsl[1], hsl[2]);
            pixels[i] = rgb[0];
            pixels[i + 1] = rgb[1];
            pixels[i + 2] = rgb[2];
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Sharpen = function (options) {
        let defaults = {
            amount: 1,
            threshold: 0,
            radius: 1,
            quality: 1
        };

        options = Object.assign(defaults, options);

        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;

        let weights = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
        let katet = Math.round(Math.sqrt(weights.length));
        let half = Math.floor(katet / 2);

        let divisor = weights.reduce((sum, weight) => sum + weight, 0) || 1;
        let offset = 0;
        let dataCopy = new Uint8ClampedArray(pixels);

        let width = canvas_node.width;
        let height = canvas_node.height;

        let iterations = Math.round(options.quality);
        let iteration = 0;

        while (iteration < iterations) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;

                    let dstOff = (y * width + x) * 4;

                    for (let cy = 0; cy < katet; cy++) {
                        for (let cx = 0; cx < katet; cx++) {
                            let scy = y + cy - half;
                            let scx = x + cx - half;

                            if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                                let srcOff = (scy * width + scx) * 4;
                                let wt = weights[cy * katet + cx];

                                r += dataCopy[srcOff] * wt;
                                g += dataCopy[srcOff + 1] * wt;
                                b += dataCopy[srcOff + 2] * wt;
                            }
                        }
                    }

                    r = Math.min(Math.max((r / divisor) + offset, 0), 255);
                    g = Math.min(Math.max((g / divisor) + offset, 0), 255);
                    b = Math.min(Math.max((b / divisor) + offset, 0), 255);
                    if (Math.abs(dataCopy[dstOff] - r) > options.threshold) {
                        pixels[dstOff] = r;
                        pixels[dstOff + 1] = g;
                        pixels[dstOff + 2] = b;
                    }
                }
            }
            iteration++;
        }
        ctx.putImageData(data, 0, 0);
    }

    Canvas.Emboss = function (options) {
        let defaults = {
            strength: 1,       // Strength of the emboss effect (e.g., 1 = normal, 2 = more intense)
            direction: 'top-left',  // Direction of emboss (options: 'top-left', 'top-right', 'bottom-left', 'bottom-right')
            blend: true,       // Blend with the original image (true or false)
            grayscale: true    // Convert the image to grayscale (true or false)
        };

        // Merge default options with user-provided options
        options = Object.assign(defaults, options);

        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let width = canvas_node.width;
        let height = canvas_node.height;

        // Create a copy of the original pixels to work from
        let dataCopy = new Uint8ClampedArray(pixels);

        // Emboss kernel based on the direction (3x3 convolution matrix)
        let kernels = {
            'top-left': [-2, -1, 0, -1, 1, 1, 0, 1, 2],
            'top-right': [0, -1, -2, 1, 1, -1, 2, 1, 0],
            'bottom-left': [0, 1, 2, -1, 1, 1, -2, -1, 0],
            'bottom-right': [2, 1, 0, 1, 1, -1, 0, -1, -2]
        };

        // Get the kernel for the chosen direction
        let kernel = kernels[options.direction] || kernels['top-left'];
        let katet = Math.sqrt(kernel.length);  // Kernel size (should be 3x3)
        let half = Math.floor(katet / 2);

        let strength = options.strength;
        let divisor = 1;  // No need to normalize the emboss effect
        let offset = 128; // Typical offset to center the pixel intensity

        // Loop through each pixel and apply the emboss kernel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;
                let dstOff = (y * width + x) * 4;  // Destination pixel offset

                // Convolution loop: Apply the kernel to each neighboring pixel
                for (let cy = 0; cy < katet; cy++) {
                    for (let cx = 0; cx < katet; cx++) {
                        let scy = y + cy - half;
                        let scx = x + cx - half;

                        // Ensure we're inside the image bounds
                        if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                            let srcOff = (scy * width + scx) * 4;  // Source pixel offset
                            let wt = kernel[cy * katet + cx];  // Weight from kernel

                            r += dataCopy[srcOff] * wt;
                            g += dataCopy[srcOff + 1] * wt;
                            b += dataCopy[srcOff + 2] * wt;
                        }
                    }
                }

                // Calculate final values
                r = (r / divisor) * strength + offset;
                g = (g / divisor) * strength + offset;
                b = (b / divisor) * strength + offset;

                // Grayscale option: average the RGB channels if grayscale is true
                if (options.grayscale) {
                    let avg = (r + g + b) / 3;
                    r = g = b = avg;
                }

                // Clamp values to the 0-255 range
                r = Math.min(Math.max(r, 0), 255);
                g = Math.min(Math.max(g, 0), 255);
                b = Math.min(Math.max(b, 0), 255);

                // If blending is enabled, blend the original image with the embossed one
                if (options.blend) {
                    pixels[dstOff] = (pixels[dstOff] + r) / 2;
                    pixels[dstOff + 1] = (pixels[dstOff + 1] + g) / 2;
                    pixels[dstOff + 2] = (pixels[dstOff + 2] + b) / 2;
                } else {
                    pixels[dstOff] = r;
                    pixels[dstOff + 1] = g;
                    pixels[dstOff + 2] = b;
                }
            }
        }

        // Write the modified image data back to the canvas
        ctx.putImageData(data, 0, 0);
    }

    Canvas.Blur = function (options) {
        let defaults = {
            radius: 5,  // Radius of the blur (higher = more blur)
            quality: 1  // Quality of the blur (number of iterations)
        };

        options = Object.assign(defaults, options);

        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let width = canvas_node.width;
        let height = canvas_node.height;

        // Generate Gaussian kernel
        function gaussianKernel(radius) {
            let size = 2 * radius + 1;
            let kernel = new Float32Array(size * size);
            let sigma = radius / 3;  // Standard deviation
            let sum = 0;
            let center = radius;

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    let dx = x - center;
                    let dy = y - center;
                    let weight = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
                    kernel[y * size + x] = weight;
                    sum += weight;
                }
            }

            for (let i = 0; i < kernel.length; i++) {
                kernel[i] /= sum;
            }

            return {
                kernel: kernel,
                size: size
            };
        }

        let { kernel, size } = gaussianKernel(options.radius);
        let half = Math.floor(size / 2);
        let iterations = Math.round(options.quality);

        function applyBlur() {
            let output = new Uint8ClampedArray(pixels);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;
                    let dstOff = (y * width + x) * 4;

                    for (let ky = 0; ky < size; ky++) {
                        for (let kx = 0; kx < size; kx++) {
                            let ny = y + ky - half;
                            let nx = x + kx - half;

                            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                                let srcOff = (ny * width + nx) * 4;
                                let weight = kernel[ky * size + kx];

                                r += pixels[srcOff] * weight;
                                g += pixels[srcOff + 1] * weight;
                                b += pixels[srcOff + 2] * weight;
                            }
                        }
                    }

                    output[dstOff] = r;
                    output[dstOff + 1] = g;
                    output[dstOff + 2] = b;
                }
            }

            return output;
        }

        // Apply the blur multiple times based on quality
        for (let i = 0; i < iterations; i++) {
            pixels = applyBlur();
        }

        ctx.putImageData(new ImageData(pixels, width, height), 0, 0);
    }
    return Canvas;
}
// Name: JSON
// Method: Plugin
// Desc: Provides methods to parse, deflate, and inflate, modify JSON objects.
// Type: Plugin
// Example: var json = Q.JSON({ key: 'value' }); json.Parse({ modify: true, recursive: true }, (key, value) => value + ' modified');
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
// Name: Q.NodeBlock
// Method: Plugin
// Desc: A plugin for creating UML blocks and connections.
// Type: Plugin
// Example: var uml = Q.NodeBlock('#canvas', 800, 600); // Create a new UML canvas
// Dependencies: ColorBrightness, isDarkColor, Style

Q.NodeBlock = function (selector, width, height, options) {

    let classes = Q.style(`

.preferences {
    position: absolute;
    width: 250px;
    max-height: 300px;
    background: #181818;
    overflow: hidden;
    overflow-y: scroll;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.pref_title {
    font-size: 12px;
    margin: 5px;
    color: #7a7a7a;
    text-align: center;
}

.preferences::-webkit-scrollbar {
    width: 10px;
}

.preferences::-webkit-scrollbar-track {
    background: #3a3a3a;
}

.preferences::-webkit-scrollbar-thumb {
    background: #242424;
}

.preferences::-webkit-scrollbar-thumb:hover {
    background: #555;
}


input[type="text"],
.pref_content {
    width: 100%;
    background-color: #1d1d1d;
    border: 0;
    outline: 0;
    color: #7a7a7a;
    font-size: 12px !important;
}

.pref_content {
    padding: 5px 15px;
}

.pref_content img {
    width: 100%;
    height: auto;
}


.connection_content {
    display: flex;
    justify-content: space-between;
}

.left,
.right {
    width: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin: 5px;
}

.connection_wrapper {
    display: flex;
    justify-content: space-between;
    margin: 1px;
}

.color_wrapper {
    position: relative;
    width: 20px;
    overflow: hidden;
}

.color_wrapper input[type="color"] {
    position: absolute;
    width: 100px;
    top: -20px;
    left: -20px;
    height: 100px;
}

.connection {
    font-size: 12px;
padding: 0 5px;
}

.button_nodes {
    background: #2e2e2e;
    color: #6e6e6e;
    border: 0;
    cursor: pointer;
    font-size: 8px;
    width: 15px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button_nodes_big {
    background: #2e2e2e;
    color: #6e6e6e;
    border: 0;
    cursor: pointer;
    font-size: 12px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button_add
{
    margin:1px;
}
        `, {
        "preferences": "preferences",
        "pref_title": "pref_title",
        "pref_content": "pref_content",
        "connection_content": "connection_content",
        "left": "left",
        "right": "right",
        "connection_wrapper": "connection_wrapper",
        "color_wrapper": "color_wrapper",
        "connection": "connection",
        "button_nodes": "button_nodes",
        "button_nodes_big": "button_nodes_big",
        "button_add": "button_add",
        "name": "_name",
        "content": "_content"
    }, false);

    console.log(classes);

    class UMLBlock {
        constructor(appearance, id, name, text, x, y, width, connLeft = [], connRight = [], connections = []) {
            this.name = name;
            this.text = text;
            this.t_text = "";
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.connections = connections;
            this.connLeft = connLeft;
            this.connRight = connRight;
            this.height = 0; // Initial height will be calculated later
            this.isDragging = false;
            this.leftConnCoords = [];
            this.rightConnCoords = [];
            this.img = null;
            this.content = null;
            this.contentHeight = 0;
            this.unescapedBase64Data = null;
            this.appearance = appearance;
            this.appearance.titleBackground = Q.ColorBrightness(this.appearance.background, -12);

            this.appearance.titleColor = Q.isDarkColor(this.appearance.background) ? '#666' : '#181818';
            this.appearance.connectionTextColor = Q.isDarkColor(this.appearance.background) ? '#666' : '#181818';
            this.appearance.textColor = Q.isDarkColor(this.appearance.background) ? '#666' : '#181818';

        }

        _drawContainer(ctx, x, y, width, height) {
            const { shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, background, radius } = this.appearance;

            // Apply shadow styles
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;

            // Draw rounded rectangle
            ctx.fillStyle = background;
            ctx.beginPath();

            // Top-left corner
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);        // Top-right corner
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Bottom-right corner
            ctx.arcTo(x, y + height, x, y + height - radius, radius);      // Bottom-left corner
            ctx.arcTo(x, y, x + radius, y, radius);                       // Top-left corner

            ctx.fill();

            // Reset shadow styles
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        _drawTitle(ctx, x, y, width, height, title) {
            ctx.fillStyle = this.appearance.titleBackground;
            ctx.beginPath();
            ctx.moveTo(x + this.appearance.radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, this.appearance.radius);
            ctx.arcTo(x + width, y + height, x, y + height, 0);
            ctx.arcTo(x, y + height, x, y, 0);
            ctx.arcTo(x, y, x + width, y, this.appearance.radius);
            ctx.closePath();
            ctx.fill();

            ctx.font = 'bold ' + this.appearance.fontSizeTitle + 'px ' + this.appearance.font;
            ctx.fillStyle = this.appearance.titleColor;
            const titleX = x + (width - ctx.measureText(title).width) / 2;
            const titleY = y + (height + this.appearance.fontSizeTitle) / 2;
            ctx.fillText(title, titleX, titleY);
        }

        parseHTML2Canvas(html, callback) {

            //remove all inline styles from html
            html = html.replace(/style="[^"]*"/g, '');

            if (this.t_text == html) {
                callback(this.content, this.contentHeight);
                return;
            }
            this.t_text = html;

            // Create a temporary container to measure the content height
            let tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.visibility = 'hidden';
            tempContainer.style.width = (this.width - this.appearance.fontSize) + 'px';
            document.body.appendChild(tempContainer);

            // Apply the same styles to the temporary container
            let style = document.createElement('style');

            let st = `
                p { margin: 0; padding: 0; color: ${this.appearance.textColor};}
                ul { margin: 5px 0px; padding-left: 15px; color: ${this.appearance.textColor};}
                li { padding: 0px; margin: 0px; }
                div { color: rgb(100, 100, 100); font-family: ${this.appearance.font}, sans-serif; font-size: ${this.appearance.fontSize}px; color: ${this.appearance.textColor};}
            `;

            style.innerHTML = st;
            document.head.appendChild(style);

            // Insert the HTML content into the temporary container
            tempContainer.innerHTML = html;

            // Measure the height of the content with styles applied
            this.contentHeight = tempContainer.offsetHeight + this.appearance.padding;

            // Remove the temporary container and style tag
            document.body.removeChild(tempContainer);
            document.head.removeChild(style);

            // Create the canvas with the measured height
            this.content = document.createElement('canvas');
            this.content.width = this.width;
            this.content.height = this.contentHeight; // Set canvas height to the measured content height
            let ctx = this.content.getContext('2d');

            let data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (this.width - (this.appearance.padding * 2)) + '" height="' + this.contentHeight + '">' + // Update SVG height
                '<foreignObject width="100%" height="100%">' +
                '<style>' +
                st +
                '</style>' +
                '<div xmlns="http://www.w3.org/1999/xhtml">' +
                html +
                '</div>' +
                '</foreignObject>' +
                '</svg>';

            let DOMURL = window.URL || window.webkitURL || window;
            let img = new Image();
            let svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
            let url = DOMURL.createObjectURL(svg);

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
                callback(this.content, this.contentHeight);
            };

            img.src = url;
        }

        // draw(ctx) {
        //     const TITLE_HEIGHT = this.appearance.fontSizeTitle + (this.appearance.padding * 2);
        //     const CONNECTION_HEIGHT = this.appearance.padding + TITLE_HEIGHT;
        //     const CONNECTION_PADDING = (this.appearance.connectionPointSize * 2) + this.appearance.connectionPointPadding;
        //     const maxConnectionsHeight = Math.max(this.connLeft.length, this.connRight.length) * CONNECTION_PADDING;

        //     // Helper function to calculate and update container height
        //     const updateContainerHeight = (contentHeight) => {
        //         this.height = TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight + contentHeight + this.appearance.padding;
        //     };

        //     // Helper function to draw the content inside the container
        //     const drawImageContent = (img, drawX, drawY, drawWidth, drawHeight) => {
        //         const contentHeight = drawHeight;
        //         updateContainerHeight(contentHeight);
        //         this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
        //         this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
        //         ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        //         this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
        //     };

        //     // Helper function to check if the content contains base64
        //     const isBase64Image = this.text.includes('base64');

        //     // Helper function to extract base64 data from text
        //     const extractBase64Data = () => {
        //         const base64Match = this.text.match(/base64,([^"]*)/);
        //         return base64Match && base64Match[1] ? base64Match[1] : null;
        //     };

        //     // If the text contains a base64 image
        //     if (isBase64Image) {
        //         const base64Data = extractBase64Data();
        //         if (!base64Data) return;

        //         // If the base64 data is already cached, use it to draw the image
        //         if (this.base64Data === base64Data.length) {
        //             const imgWidth = this.img.width;
        //             const imgHeight = this.img.height;
        //             const aspectRatio = imgHeight / imgWidth;
        //             const drawWidth = this.width - this.appearance.padding;
        //             const drawHeight = drawWidth * aspectRatio;
        //             const drawX = this.x + this.appearance.padding / 2;
        //             const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight;

        //             drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
        //             return;
        //         }

        //         // Load the base64 image and draw it once loaded
        //         const unescapedBase64Data = 'data:image/png;base64,' + decodeURIComponent(base64Data);
        //         this.img = new Image();
        //         this.img.src = unescapedBase64Data;
        //         this.base64Data = base64Data.length;

        //         this.img.onload = () => {
        //             const imgMatch = this.text.match(/<img[^>]+src="([^">]+)"/);
        //             if (imgMatch && imgMatch[1]) {
        //                 this.text = `<img src="${imgMatch[1]}"/>`;
        //             }

        //             const imgWidth = this.img.width;
        //             const imgHeight = this.img.height;
        //             const aspectRatio = imgHeight / imgWidth;
        //             const drawWidth = this.width - this.appearance.padding;
        //             const drawHeight = drawWidth * aspectRatio;
        //             const drawX = this.x + 5;
        //             const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight;

        //             drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
        //         };

        //         return;
        //     } else {
        //         // If not base64, parse HTML content and render it as a canvas
        //         this.parseHTML2Canvas(this.text, (canvas, contentHeight) => {
        //             updateContainerHeight(contentHeight);
        //             this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
        //             this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
        //             ctx.drawImage(canvas, this.x + this.appearance.padding, this.y + TITLE_HEIGHT + this.appearance.padding + maxConnectionsHeight);
        //             this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
        //         });
        //     }
        // }

        draw(ctx) {
            const TITLE_HEIGHT = this.appearance.fontSizeTitle + (this.appearance.padding * 2);
            const CONNECTION_HEIGHT = this.appearance.padding + TITLE_HEIGHT;
            const CONNECTION_PADDING = (this.appearance.connectionPointSize * 2) + this.appearance.connectionPointPadding;
            const maxConnectionsHeight = Math.max(this.connLeft.length, this.connRight.length) * CONNECTION_PADDING;

            // Helper function to calculate and update container height
            const updateContainerHeight = (contentHeight) => {
                this.height = TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight + contentHeight + this.appearance.padding;
            };

            // Helper function to draw the content inside the container
            const drawImageContent = (img, drawX, drawY, drawWidth, drawHeight) => {
                const contentHeight = drawHeight;
                updateContainerHeight(contentHeight);
                this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
                this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
            };

            // Helper function to check if the content contains base64
            const isBase64Image = this.text.includes('base64');

            // Helper function to extract base64 data from text
            const extractBase64Data = () => {
                const base64Match = this.text.match(/base64,([^"]*)/);
                return base64Match && base64Match[1] ? base64Match[1] : null;
            };

            // If the text contains a base64 image
            if (isBase64Image) {
                const base64Data = extractBase64Data();
                if (!base64Data) return;

                // If the base64 data is already cached, use it to draw the image
                if (this.base64Data === base64Data.length) {
                    const imgWidth = this.img.width;
                    const imgHeight = this.img.height;
                    const aspectRatio = imgHeight / imgWidth;
                    const drawWidth = this.width - this.appearance.padding;
                    const drawHeight = drawWidth * aspectRatio;
                    const drawX = this.x + this.appearance.padding / 2;
                    const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight;

                    drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
                    return;
                }

                // Load the base64 image and draw it once loaded
                const unescapedBase64Data = 'data:image/png;base64,' + decodeURIComponent(base64Data);
                this.img = new Image();
                this.img.src = unescapedBase64Data;
                this.base64Data = base64Data.length;

                this.img.onload = () => {
                    const imgMatch = this.text.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch && imgMatch[1]) {
                        this.text = `<img src="${imgMatch[1]}"/>`;
                    }

                    const imgWidth = this.img.width;
                    const imgHeight = this.img.height;
                    const aspectRatio = imgHeight / imgWidth;
                    const drawWidth = this.width - this.appearance.padding;
                    const drawHeight = drawWidth * aspectRatio;
                    const drawX = this.x + 5;
                    const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight;

                    drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
                };

                return;
            } else {
                // If not base64, parse HTML content and render it as a canvas
                this.parseHTML2Canvas(this.text, (canvas, contentHeight) => {
                    updateContainerHeight(contentHeight);
                    this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
                    this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
                    ctx.drawImage(canvas, this.x + this.appearance.padding, this.y + TITLE_HEIGHT + this.appearance.padding + maxConnectionsHeight);
                    this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
                });
            }
        }


        drawConnectionPoints(ctx, paddingTop, height) {
            const connectionY = this.y + paddingTop;
            const font = `bold ${this.appearance.fontSizeConnection}px ${this.appearance.font}`;
            const pointSize = this.appearance.connectionPointSize;
            const textColor = this.appearance.connectionTextColor;
            const connectionPaddingX = this.appearance.connectionTextPaddingX;
            const middleYOffset = ((pointSize / 2) + (this.appearance.fontSizeConnection / 2)) - this.appearance.connectionTextPaddingY;

            this.leftConnCoords = [];
            this.rightConnCoords = [];

            ctx.font = font;

            const drawConnectionPoints = (connList, coordsArray, baseX, getTextX) => {
                connList.forEach((conn, index) => {
                    const connY = connectionY + index * height;
                    coordsArray.push({ x: baseX, y: connY });

                    ctx.fillStyle = conn.color || this.appearance.connectionColor;
                    ctx.beginPath();
                    ctx.arc(baseX, connY, pointSize, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = textColor;
                    ctx.fillText(conn.title, getTextX(conn.title, baseX), connY + middleYOffset);
                });
            };

            if (Array.isArray(this.connLeft)) {
                drawConnectionPoints(this.connLeft, this.leftConnCoords, this.x, (title, baseX) => baseX + connectionPaddingX * 2);
            }

            if (Array.isArray(this.connRight)) {
                drawConnectionPoints(this.connRight, this.rightConnCoords, this.x + this.width, (title, baseX) => baseX - ctx.measureText(title).width - connectionPaddingX * 2);
            }
        }


        addConnection(conn) {
            this.connections.push(conn);
        }

        removeConnection(conn) {
            this.connections = this.connections.filter(c => c.id !== conn.id);
        }

        isMouseOver(mouseX, mouseY) {
            return mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height;
        }

        getAllConnectionCoords() {
            return [...this.leftConnCoords, ...this.rightConnCoords];
        }

        getConnectionCoord(point, index) {
            return point === 'left' ? this.leftConnCoords[index] : this.rightConnCoords[index];
        }
    }

    class UMLCanvas {
        constructor(selector, width, height, appearance, classes) {
            this.element_parent = Q(selector);
            this.canvas = Q('<canvas>', { width: width, height: height });
            this.width = width;
            this.height = height;
            this.element_parent.append(this.canvas);
            this.canvas_context = this.canvas.nodes[0].getContext('2d');
            this.blocks = [];
            this.connections = [];
            this.draggingBlock = null;
            this.offsetX = 0;
            this.offsetY = 0;
            this.connection_start = null;
            this.connection_end = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.isMenuPreferences = false;
            this.isDraggingBlock = false;
            this.isOverConnection = false;
            this.appearance = appearance;
            this.classes = classes;

            this.canvas.on('click', this._event_click.bind(this)); // For handling clicks on connection points
            this.canvas.on('mousedown', this._event_pointer_down.bind(this));
            this.canvas.on('mousemove', this._event_pointer_move.bind(this));
            this.canvas.on('mouseup', this._event_pointer_up.bind(this));
            this.canvas.on('contextmenu', this._event_click_right.bind(this), false); // For handling right-clicks to break connections
        }

        import(uml) {
            // Collect promises for each block creation
            const blockCreationPromises = uml.blocks.map(async (block) => {
                // Modify UMLBlock initialization to be promise-aware.
                const newBlock = new UMLBlock(
                    this.appearance,
                    block.id, block.name, block.text, block.x, block.y, block.width,
                    block.connLeft.map(conn => ({ id: conn.id, title: conn.title, color: conn.color })),
                    block.connRight.map(conn => ({ id: conn.id, title: conn.title, color: conn.color })),
                    block.connections
                );
                this.addBlock(newBlock);
            });

            // Wait for all block creations to finish
            Promise.all(blockCreationPromises).then(() => {
                // After all blocks are added, create connections
                uml.connections.forEach(conn => {
                    const startBlock = this.blocks.find(b => b.id === conn.id);
                    const endBlock = this.blocks.find(b => b.id === conn.target);

                    const startCoords = this._point_coords(startBlock, conn.point);
                    const endCoords = this._point_coords(endBlock, conn.targetPoint);

                    if (startCoords && endCoords) {
                        this._connection_create(
                            { block: startBlock, point: conn.point, x: startCoords.x, y: startCoords.y },
                            { block: endBlock, point: conn.targetPoint, x: endCoords.x, y: endCoords.y }
                        );
                    } else {
                        console.error('Connection failed to initialize:', startBlock, endBlock);
                    }
                });
            }).catch(err => {
                console.error('Error during block initialization:', err);
            });
        }

        export() {
            return {
                blocks: this.blocks.map(block => ({
                    id: block.id,
                    name: block.name,
                    text: block.text,
                    x: block.x,
                    y: block.y,
                    width: block.width,
                    connLeft: block.connLeft,
                    connRight: block.connRight,
                    connections: block.connections
                })),
                connections: this.connections.map(conn => ({
                    id: conn.start.block.id,
                    point: conn.start.point,
                    target: conn.end.block.id,
                    targetPoint: conn.end.point
                }))
            };
        }

        async addBlock(block) {
            this.blocks.push(block);
            await this._connections_init(block);
            this.render();
        }

        removeBlock(block) {
            this.blocks = this.blocks.filter(b => b.id !== block.id);
            this.connections = this.connections.filter(conn =>
                conn.start.block.id !== block.id && conn.end.block.id !== block.id
            );
            this.render();
        }

        render() {
            this.canvas_context.clearRect(0, 0, this.width, this.height);

            // Draw the connections

            // if(this.isDraggingBlock){
            this.connections.forEach(conn => {
                let startColor = this._getConnectionColor(conn.start.block, conn.start.point);
                let endColor = this._getConnectionColor(conn.end.block, conn.end.point);

                this.canvas_context.strokeStyle = 'rgb(150, 150, 150)';

                this.canvas_context.beginPath();

                // Line thickness
                this.canvas_context.lineWidth = 2;

                // Gradient from start to end point using their colors
                let gradient = this.canvas_context.createLinearGradient(conn.start.x, conn.start.y, conn.end.x, conn.end.y);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, endColor);
                this.canvas_context.strokeStyle = gradient;

                this.canvas_context.moveTo(conn.start.x, conn.start.y);
                this.canvas_context.lineTo(conn.end.x, conn.end.y);
                this.canvas_context.stroke();

                // Calculate direction vector
                let dx = conn.end.x - conn.start.x;
                let dy = conn.end.y - conn.start.y;
                let length = Math.sqrt(dx * dx + dy * dy);
                let unitDx = dx / length;
                let unitDy = dy / length;

                // Draw arrows every 100px
                let arrowLength = 10;
                let arrowWidth = 5;
                for (let i = 100; i < length; i += 200) {
                    let x = conn.start.x + unitDx * i;
                    let y = conn.start.y + unitDy * i;

                    this.canvas_context.beginPath();
                    this.canvas_context.moveTo(x, y);
                    this.canvas_context.lineTo(x - arrowLength * unitDx + arrowWidth * unitDy, y - arrowLength * unitDy - arrowWidth * unitDx);
                    this.canvas_context.lineTo(x - arrowLength * unitDx - arrowWidth * unitDy, y - arrowLength * unitDy + arrowWidth * unitDx);
                    this.canvas_context.closePath();
                    this.canvas_context.fillStyle = gradient;
                    this.canvas_context.fill();
                }
            });

            // Draw the connection if dragging
            if (this.connection_start && this.connection_end === null) {
                let startColor = this._getConnectionColor(this.connection_start.block, this.connection_start.point);

                let gradient = this.canvas_context.createLinearGradient(this.connection_start.x, this.connection_start.y, this.mouseX, this.mouseY);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, "rgb(150, 150, 150)");  // Default color for the temp connection endpoint
                this.canvas_context.strokeStyle = gradient;

                this.canvas_context.beginPath();
                this.canvas_context.moveTo(this.connection_start.x, this.connection_start.y);
                this.canvas_context.lineTo(this.mouseX, this.mouseY);
                this.canvas_context.stroke();
            }

            this.blocks.forEach(block => {
                block.draw(this.canvas_context);
            });
        }

        // New method to get the color of a connection point
        _getConnectionColor(block, pointId) {
            for (let i = 0; i < block.connLeft.length; i++) {
                if (block.connLeft[i].id === pointId) {
                    return block.connLeft[i].color;
                }
            }

            for (let i = 0; i < block.connRight.length; i++) {
                if (block.connRight[i].id === pointId) {
                    return block.connRight[i].color;
                }
            }
        }

        updateConnections(block) {

            let preferences = Q('.' + classes.preferences);

            let left = preferences.find('.' + classes.left);
            let right = preferences.find('.' + classes.right);

            let leftConnections = block.connLeft;
            let rightConnections = block.connRight;

            // Function to update connections


            // Collect new connections
            let newLeftConnections = [];
            left.find('.' + classes.connection_wrapper).walk((element) => {

                // left.querySelectorAll('.connection_wrapper').forEach(c => {
                let id = element.id();
                let title = element.find('.' + classes.connection).val();
                let color = element.find('.' + classes.color).val();

                newLeftConnections.push({ id: id, title: title, color: color });
            }, true);

            let newRightConnections = [];
            right.find('.' + classes.connection_wrapper).walk((element) => {
                let id = element.id();
                let title = element.find('.' + classes.connection).val();
                let color = element.find('.' + classes.color).val();
                newRightConnections.push({ id: id, title: title, color: color });
            }, true);

            let newConnections = [...newLeftConnections, ...newRightConnections];
            let existingConnections = [...leftConnections, ...rightConnections];

            newConnections.forEach(newConn => {
                let existingConn = existingConnections.find(conn => conn.id === newConn.id);
                if (existingConn) {
                    existingConn.title = (newConn.title && newConn.title !== null) ? newConn.title : '';
                    existingConn.color = newConn.color;
                } else {
                    existingConnections.push(newConn);
                }
            });
        }

        updateBlock(selectedblock = null) {
            let preferences = Q('.' + classes.preferences);
            let block;
            if (selectedblock) {
                block = selectedblock;
            }
            else {
                block = this.blocks.find(b => b.id === preferences.id());
            }
            // let block = this.blocks.find(b => b.id === preferences.id());
            let name = preferences.find('#' + classes.name).text();
            let content = preferences.find('#' + classes.content).html();
            block.name = name;
            block.text = content;
        }


        _event_pointer_down(event) {
            if (event.button === 2) return; // Ignore right-click for dragging
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            if (this.isMenuPreferences) {
                this.isMenuPreferences = false;

                if (!Q.isExists('.' + classes.preferences + ' #' + classes.name)) {
                    this._menu_remove();
                    return;
                }

                let block = this.blocks.find(b => b.id === Q('.' + classes.preferences).id());

                this.updateBlock(block);

                this.updateConnections(block);
                this._menu_remove();
                this.render();
            }

            for (let i = this.blocks.length - 1; i >= 0; i--) {
                let block = this.blocks[i];
                if (block.isMouseOver(mouseX, mouseY)) {
                    this.isDraggingBlock = true;
                    // Handle dragging the block
                    this.draggingBlock = block;
                    this.offsetX = mouseX - block.x;
                    this.offsetY = mouseY - block.y;
                    block.isDragging = true;
                    break;
                }
            }
        }
        _event_pointer_move(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            if (this.draggingBlock) {
                this.draggingBlock.x = mouseX - this.offsetX;
                this.draggingBlock.y = mouseY - this.offsetY;
                this._connection_update();
                this.render();
                return;
            }

            if (this.connection_start && this.connection_end === null) {
                this.mouseX = mouseX;
                this.mouseY = mouseY;
                this.render();
                return;
            }

            if (this.isOverConnection) {
                this.isOverConnection = false;
                this.render();
            }

            this.connections.forEach(conn => {

                //check if hovering over a connection. If so, draw a glow
                if (this._point_line_segment(mouseX, mouseY, conn.start.x, conn.start.y, conn.end.x, conn.end.y)) {

                    if (!this.isOverConnection) {

                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.start.x, conn.start.y, this.appearance.connectionPointSize + 2, 0, 2 * Math.PI);
                        let startColor = this._getConnectionColor(conn.start.block, conn.start.point);
                        this.canvas_context.strokeStyle = startColor;
                        this.canvas_context.lineWidth = 2;
                        this.canvas_context.stroke();

                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.end.x, conn.end.y, this.appearance.connectionPointSize + 2, 0, 2 * Math.PI);
                        let endColor = this._getConnectionColor(conn.end.block, conn.end.point);
                        this.canvas_context.strokeStyle = endColor;
                        this.canvas_context.lineWidth = 2;
                        this.canvas_context.stroke();

                        this.isOverConnection = true;
                    }
                }
            });
        }
        _event_pointer_up(event) {
            if (this.draggingBlock) {
                this.isDraggingBlock = false;
                this.draggingBlock.isDragging = false;
                this.draggingBlock = null;
                this._connection_update();
                this.render();
            }

            if (this.connection_start && this.connection_end === null) {
                // Cancel the active connection if mouse is released without connecting
                setTimeout(() => {
                    this.connection_start = null;
                    this.mouseX = 0;
                    this.mouseY = 0;
                    this.render();
                }, 100);
            }
        }

        _event_click(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            for (let block of this.blocks) {
                if (this._connection_over_point(block, mouseX, mouseY)) {
                    if (this.connection_start === null) {
                        this.connection_start = this._point_details(block, mouseX, mouseY);
                    }
                    else if (this.connection_end === null) {
                        this.connection_end = this._point_details(block, mouseX, mouseY);

                        // Ensure there's no self-referencing connections
                        if (this.connection_start.block !== this.connection_end.block &&
                            !this._connection_exists(this.connection_start, this.connection_end)) {
                            // !this._blocks_connected(this.connection_start.block, this.connection_end.block)) {
                            this._connection_create(this.connection_start, this.connection_end);
                            console.log('Connection created between', this.connection_start, 'and', this.connection_end);
                            block.addConnection({ id: this.connection_start.block.id, point: this.connection_start.point });
                            console.log('Connection created');
                        } else {
                            console.log('Connection already exists or blocks are already connected');
                            this.connection_start = null;
                            this.connection_end = null;
                            this.render();
                        }

                        // Reset the connection points
                        this.connection_start = null;
                        this.connection_end = null;
                    }
                    return;
                }
            }
        }


        _menu_context(x, y) {
            let div = Q('<div>', { class: ['preferences'], style: { position: 'absolute', left: x + 'px', top: y + 'px' } });
            this.isMenuPreferences = true;

            let add = Q('<div>', { class: ['button_nodes_big'], text: 'Create Block' });
            add.on('click', () => {

                let id = this._id();
                let block = new UMLBlock(this.appearance, id, 'Class', 'Content', x, y, 200, [{ id: this._id(), title: 'Left', color: '#333333' }], [{ id: this._id(), title: 'Right', color: '#333333' }]);
                this.addBlock(block);
                this._menu_remove();
            });
            div.append(add);
            this.element_parent.append(div);
        }


        _event_click_right(event) {
            event.preventDefault(); // Prevent the context menu from appearing

            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            //check if the right click is on a block
            for (let i = this.blocks.length - 1; i >= 0; i--) {
                let block = this.blocks[i];
                if (block.isMouseOver(mouseX, mouseY)) {
                    this._menu_remove();
                    this._menu_preferences(block, mouseX, mouseY);
                    return;
                }
            }

            if (this.isMenuPreferences) {
                this.updateBlock();
                this._menu_remove();
                this.isMenuPreferences = false;
            }

            // Remove any connection that is clicked on

            for (let i = 0; i < this.connections.length; i++) {
                let conn = this.connections[i];
                if (this._point_line_segment(mouseX, mouseY, conn.start.x, conn.start.y, conn.end.x, conn.end.y)) {
                    // Remove the connection from the block's connections list
                    const startBlock = this.blocks.find(b => b.id === conn.start.block.id);
                    const endBlock = this.blocks.find(b => b.id === conn.end.block.id);

                    if (startBlock && endBlock) {
                        startBlock.removeConnection({ id: endBlock.id, point: conn.start.point });
                    }

                    // Remove the connection from the connections list
                    this.connections.splice(i, 1);

                    this.render();
                    return;
                }
            }
            this._menu_context(mouseX, mouseY);
            this.render();
        }

        _id() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }


        _menu_remove() {
            Q('.' + classes.preferences).remove();
        }

        //DRAW PREFS
        _menu_item_section(title, content) {
            let div = Q('<div>', { class: [classes.pref_section] });
            let titleDiv = Q('<div>', { class: [classes.pref_title], text: title });
            div.append(titleDiv, content);
            return div;
        }

        _menu_item_input(id, content, placeholder) {
            let input = Q('<div>', { class: [classes.pref_content], id: id, contentEditable: true, html: content, placeholder: placeholder });
            return input;
        }

        _menu_item_connections(block) {

            let div = Q('<div>', { class: [classes.connection_content] });
            let left = Q('<div>', { class: [classes.left] });
            let right = Q('<div>', { class: [classes.right] });

            const connItem = (pos, conn) => {

                let connection_wrapper = Q('<div>', { class: [classes.connection_wrapper], id: conn.id });
                let connection = Q('<input>', { class: [classes.connection], type: 'text', value: conn.title, placeholder: 'Point...', maxLength: 10 });
                let color_wrapper = Q('<div>', { class: [classes.color_wrapper] });
                let color = Q('<input>', { class: [classes.color], type: 'color', value: conn.color });

                color_wrapper.append(color);

                color.on('change', () => {
                    conn.color = color.val();
                    this.render();
                });

                connection.on('input', () => {
                    let contitle = connection.val();
                    conn.title = (conn.title && contitle !== null) ? contitle : '';
                    this.updateConnections(block);
                    this.render();
                });
                connection_wrapper.append(color_wrapper, connection);

                let remove = Q('<div>', { class: [classes.button_nodes], text: 'X' });
                remove.on('click', () => {
                    connection_wrapper.remove();
                    this.connections = this.connections.filter(c => {
                        if (c.start.block.id === block.id && c.start.point === conn.id) {
                            let targetBlock = this.blocks.find(b => b.id === c.end.block.id);
                            targetBlock.removeConnection({ id: block.id, point: c.end.point });
                            return false;
                        }
                        if (c.end.block.id === block.id && c.end.point === conn.id) {
                            let targetBlock = this.blocks.find(b => b.id === c.start.block.id);
                            targetBlock.removeConnection({ id: block.id, point: c.start.point });
                            return false;
                        }
                        return true;
                    });
                    if (pos === 'left') { block.connLeft = block.connLeft.filter(c => c.id !== conn.id); }
                    if (pos === 'right') { block.connRight = block.connRight.filter(c => c.id !== conn.id); }
                    this.render();
                });
                connection_wrapper.append(remove);
                return connection_wrapper;
            };

            block.connLeft.forEach(conn => {
                let connection_wrapper = connItem('left', conn);
                left.append(connection_wrapper);
            });

            block.connRight.forEach(conn => {
                let connection_wrapper = connItem('right', conn);
                right.append(connection_wrapper);
            });


            let add = Q('<button>', { class: [classes.button_nodes, classes.button_add], text: '+' });
            add.on('click', () => {

                let id = this._id();
                let connection = { id: id, title: '', color: '#333333' };
                block.connLeft.push(connection);
                left.append(connItem('left', connection));
                left.append(add);
                this.render();
            });
            left.append(add);

            let addRight = Q('<button>', { class: [classes.button_nodes, classes.button_add], text: '+' });
            addRight.on('click', () => {
                let id = this._id();
                let connection = { id: id, title: '', color: '#333333' };
                block.connRight.push(connection);
                right.append(connItem('right', connection));
                right.append(addRight);
                this.render();
            });
            right.append(addRight);

            div.append(left, right);
            return div;
        }

        _menu_preferences(block, x, y) {
            let div = Q('<div>', { class: [classes.preferences], id: block.id });
            div.css({ position: 'absolute', left: x + 'px', top: y + 'px' });

            this.isMenuPreferences = true;

            let title = this._menu_item_section('Class', this._menu_item_input(classes.name, block.name, 'Class name...'));
            let content = this._menu_item_section('Content', this._menu_item_input(classes.content, block.text, 'Content...'));
            let connections = this._menu_item_section('Connections', this._menu_item_connections(block));

            div.append(title, content, connections);

            this.element_parent.append(div);
        }

        _connections_init(block) {
            block.connections.forEach(conn => {
                const targetBlock = this.blocks.find(b => b.id === conn.id);
                if (targetBlock) {
                    const startCoords = this._point_coords(block, 'right');
                    const endCoords = this._point_coords(targetBlock, 'left');
                    this._connection_create(
                        { block: block, point: 'right', x: startCoords.x, y: startCoords.y },
                        { block: targetBlock, point: conn.point, x: endCoords.x, y: endCoords.y }
                    );
                }
            });
        }

        _blocks_connected(block1, block2) {
            return this.connections.some(connection =>
                (connection.start.block === block1 && connection.end.block === block2) ||
                (connection.start.block === block2 && connection.end.block === block1)
            );
        }

        _connection_exists(startConn, endConn) {
            return this.connections.some(conn =>
                (conn.start.block === startConn.block && conn.start.point === startConn.point &&
                    conn.end.block === endConn.block && conn.end.point === endConn.point) ||
                (conn.start.block === endConn.block && conn.start.point === endConn.point &&
                    conn.end.block === startConn.block && conn.end.point === startConn.point)
            );
        }

        _connection_create(startConn, endConn) {
            this.connections.push({
                start: { block: startConn.block, point: startConn.point, x: startConn.x, y: startConn.y },
                end: { block: endConn.block, point: endConn.point, x: endConn.x, y: endConn.y }
            });

            //add to the block's connections
            startConn.block.addConnection({ id: endConn.block.id, point: startConn.point });
            endConn.block.addConnection({ id: startConn.block.id, point: endConn.point });

            this.render();
        }

        _connection_update() {
            this.connections.forEach(conn => {
                const startCoords = this._point_coords(conn.start.block, conn.start.point);
                const endCoords = this._point_coords(conn.end.block, conn.end.point);
                conn.start.x = startCoords.x;
                conn.start.y = startCoords.y;
                conn.end.x = endCoords.x;
                conn.end.y = endCoords.y;
            });
        }

        _point_coords(block, pointId) {
            const leftCoords = block.leftConnCoords;
            const rightCoords = block.rightConnCoords;

            // Iterate through the connection points to find the matching pointId
            for (let i = 0; i < block.connLeft.length; i++) {
                if (block.connLeft[i].id === pointId) {
                    return { x: leftCoords[i].x, y: leftCoords[i].y };
                }
            }

            for (let i = 0; i < block.connRight.length; i++) {
                if (block.connRight[i].id === pointId) {
                    return { x: rightCoords[i].x, y: rightCoords[i].y };
                }
            }

            // Return a default coordinate if not found
            return { x: block.x, y: block.y };
        }

        _connection_over_point(block, x, y) {
            const radius = 5;
            return block.getAllConnectionCoords().some(coord => Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius);
        }

        _point_details(block, x, y) {
            const radius = 5;
            let matchedPoint = null;

            block.leftConnCoords.forEach((coord, index) => {
                if (Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius) {
                    matchedPoint = { block: block, point: block.connLeft[index].id, x: coord.x, y: coord.y, index: index };
                }
            });

            if (!matchedPoint) {
                block.rightConnCoords.forEach((coord, index) => {
                    if (Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius) {
                        matchedPoint = { block: block, point: block.connRight[index].id, x: coord.x, y: coord.y, index: index };
                    }
                });
            }

            return matchedPoint;
        }

        _point_line_segment(px, py, x1, y1, x2, y2) {
            const distance = this._point_line_distance(px, py, x1, y1, x2, y2);
            const buffer = 5; // Adjust the acceptable distance buffer as needed
            return distance <= buffer;
        }

        _point_line_distance(px, py, x1, y1, x2, y2) {
            const A = px - x1;
            const B = py - y1;
            const C = x2 - x1;
            const D = y2 - y1;

            const dot = (A * C) + (B * D);
            const len_sq = (C * C) + (D * D);
            let param = -1;
            if (len_sq !== 0) {
                param = dot / len_sq;
            }

            let xx, yy;
            if (param < 0) {
                xx = x1;
                yy = y1;
            } else if (param > 1) {
                xx = x2;
                yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }

            const dx = px - xx;
            const dy = py - yy;
            return Math.sqrt((dx * dx) + (dy * dy));
        }
    }

    let appearance = {
        background: '#181818',
        titleColor: 'rgb(150, 150, 150)',
        textColor: 'rgb(100, 100, 100)',
        connectionColor: 'rgb(60, 60, 60)',
        connectionPointSize: 5,
        connectionPointPadding: 5,
        connectionTextPaddingX: 5,
        connectionTextPaddingY: 5,
        connectionTextColor: 'rgb(100, 100, 100)',
        separatorColor: 'rgb(50, 50, 50)',
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        font: 'Arial',
        fontSize: 12,
        fontSizeTitle: 12,
        fontSizeConnection: 10,
        padding: 10,
        radius: 10
    };

    appearance = Object.assign(appearance, options);
    let uml = new UMLCanvas(selector, width, height, appearance, classes);

    return {
        import: function (data) {
            uml.import(data);
        },
        export: function () {
            return uml.export();
        },
        addBlock: function (block) {
            uml.addBlock(block);
        },
        removeBlock: function (block) {
            uml.removeBlock(block);
        }
    };

}

// Name: Socket
// Method: Plugin
// Desc: Provides a WebSocket implementation with automatic reconnection and status callbacks.
// Type: Plugin
// Example: var socket = Q.Socket('ws://localhost:8080', console.log, console.log);
Q.Socket = function (url, onMessage, onStatus, options = {}) {
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
// Name: Storage
// Method: Plugin
// Desc: Provides methods to store and retrieve data from the local storage.
// Type: Plugin
// Example: Q.Storage('key', 'value to store'); Q.Storage('key'); // returns 'value to store'
Q.Storage = function (key, value) {
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


// Name: String
// Method: Plugin
// Desc: Provides methods to manipulate strings.
// Type: Plugin
// Example: Q.String('hello').capitalize(); // returns 'Hello'
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
// Name: Style
// Method: Plugin
// Desc: Provides methods to apply global styles to the document. It's useful for applying CSS variables from JavaScript. Q.style will be removed after the styles are applied on the document ready event.
// Type: Plugin
// Example: Q.style(':root { --color: red; } body { background-color: var(--color); }');
// Dependencies: ID
Q.style = (function () {
    let styleData = {
        gen: "",
        root: '',
        element: null,
        checked: false,
    };

    function applyStyles() {
        if (!styleData.init) {
            styleData.element = document.getElementById('qlib-root-styles') || createStyleElement();
            styleData.init = true;
        }

        let finalStyles = '';

        if (styleData.root) {
            //add only root styles if they exist
            finalStyles = `:root {${styleData.root}}\n`;
        }

        finalStyles += styleData.gen;

        styleData.element.textContent = finalStyles;
    }

    function createStyleElement() {
        const styleElement = document.createElement('style');
        styleElement.id = 'qlib-root-styles';
        document.head.insertBefore(styleElement, document.head.firstChild);
        return styleElement;
    }

    window.addEventListener('load', () => {
        console.log('Styles plugin loaded.');

        //we should destroy the Q.style function after the document is loaded to prevent further usage.
        delete Q.style;

    }, { once: true });

    return function (styles, mapping = null, obfuscate = false) {
        if (typeof styles === 'string') {
            const rootContentMatch = styles.match(/:root\s*{([^}]*)}/);
            if (rootContentMatch) {
                styles = styles.replace(rootContentMatch[0], '');
                const rootContent = rootContentMatch[1].split(';').map(item => item.trim()).filter(item => item);
                styleData.root += rootContent.join(';') + ';';
            }

            // if (!disableObfuscation && Object.keys(mapping).length === 0) {
            //     const generatedKeys = new Set();
            //     mapping = Object.keys(mapping).reduce((acc, key) => {
            //         let newKey;
            //         do {
            //             newKey = ID(5,'_');
            //         } while (generatedKeys.has(newKey));

            //         generatedKeys.add(newKey);
            //         acc[key] = newKey;
            //         styles = styles.replace(new RegExp(`\\b${key}\\b`, 'gm'), acc[key]);
            //         return acc;
            //     }, {});
            // }


            //obfuscate the class and id names using the mapping object. mapping object may contain . and #.
            if (obfuscate && mapping) {
                const keys = Object.keys(mapping);
                keys.forEach((key) => {
                    let newKey = Q.ID(5, '_');

                    //replace all occurrences of the key in the styles string and update the mapping object value.
                    styles = styles.replace(new RegExp(`\\b${key}\\b`, 'gm'), newKey);
                    //replace the value of the key in the mapping object as well.
                    mapping[key] = mapping[key].replace(key, newKey);



                });
            }



            styleData.gen += styles;

            applyStyles();
                return mapping;
        } else {
            console.error('Invalid styles parameter. Expected a string.');
        }
    };
})();
// Name: Task
// Method: Plugin
// Desc: Provides methods to run tasks asynchronously and handle their completion or failure. Basically a Promise wrapper, but with more control.
// Type: Plugin
// Example: var task = Q.Task('task1', () => console.log('Task 1'), () => console.log('Task 2')); task.Run();
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
// Name: Timer
// Method: Plugin
// Desc: Provides a timer implementation with automatic stop and interrupt. Useful for running tasks at intervals or for a specific duration.
// Type: Plugin
// Example: Q.Timer(() => console.log('Tick'), 'timer1', { tick: 5, delay: 1000, interrupt: true });
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