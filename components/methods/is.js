/**
 * @metadata
 * {
 *   "name": "is",
 *   "method": "is(selector)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Checks if the first element matches the given selector, function, or element. Supports pseudo-selectors like :visible, :hidden, etc.",
 *   "longDesc": "This method tests whether the first element in the selection matches the specified criteria. It supports CSS selectors, custom pseudo-selectors (:visible, :hidden, :hover, :focus, :checked), function tests, and direct element comparisons. The method provides a comprehensive way to check element states and properties for conditional logic.",
 *   "dependencies": [],
 *   "variables": ["node", "selector"],
 *   "examples": [
 *     "Q('.item').is('.active');",
 *     "Q('#input').is(':checked');",
 *     "Q('.element').is(function() { return this.offsetWidth > 100; });"
 *   ],
 *   "flaws": "Only checks first element, limited pseudo-selector support",
 *   "optimizations": "Add more pseudo-selectors, add support for multiple elements",
 *   "performance": "O(1) for most checks, O(h) for complex selectors"
 * }
 */
Q.Method('is', function (selector) {
    var node = this.nodes[0];
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
