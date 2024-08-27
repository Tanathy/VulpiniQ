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
                let elem = document.querySelectorAll(selector);
                this.nodes = Array.from(elem);
            }
        }
    }
    //METHODS//
    //EXTENSIONS//

    return Q;
})();