// Name: is
// Method: Prototype
// Desc: Checks if the first node matches a specific selector or condition, allowing for dynamic queries and element comparisons.
// Long Desc: This method verifies if the first selected node corresponds to the specified selector or condition. It supports various selectors such as ":visible", ":hidden", ":hover", and allows function-based conditions. The method returns a boolean indicating whether the condition holds true for the selected node, enabling flexible checks against DOM elements.
// Type: Utilities
// Example: Q(selector).is(":visible"); // Checks if the element is currently visible <br> Q(selector).is(":checked"); // Checks if a checkbox or radio button is checked <br> Q(selector).is(anotherElement); // Compares the first node with another DOM element <br> Q(selector).is(":hover"); // Checks if the element is currently being hovered over
// Variables: selector, node
Q.Ext('is', function (selector) {
    const node = this.nodes[0];

    if (!node) return false;

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
});