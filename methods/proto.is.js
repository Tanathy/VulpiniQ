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
