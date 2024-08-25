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
                // let elem;
                // switch (selector) {
                //     case 'body':
                //         elem = [document.body];
                //     case 'head':
                //         elem = [document.head];
                //     case 'document':
                //         elem = [document];
                //     default:
                //         elem = document.querySelectorAll(selector);
                // }
                let elem = document.querySelectorAll(selector);
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

    Q.prototype.html = function (...content) {
        // Gets or sets the innerHTML of the nodes.|Content Manipulation|Q(selector).html(string);

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
        // Gets or sets attributes on the nodes. Can handle multiple attributes if provided as an object.|Attribute Manipulation|Q(selector).attr(attribute, value);
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

    Q.prototype.size = function () {
        // Returns the width and height of the first node.|Dimensions|Q(selector).size();
        return {
            width: this.nodes[0].offsetWidth,
            height: this.nodes[0].offsetHeight
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
                    if (callback) callback.call(element);
                }, duration);
            }
        }), this;
    };

    Q.prototype.removeTransition = function () {
        // Removes the transition from each node.|Display|Q(selector).removeTransition();
        return this.each(el => this.nodes[el].style.transition = '');
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

    Q.Done = function (callback) {
        window.addEventListener('load', callback, { once: true });
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

    //EXTENSIONS//

    return Q;
})();