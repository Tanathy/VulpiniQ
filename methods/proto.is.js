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