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
    //EXTENSIONS//
    return Q;
})();