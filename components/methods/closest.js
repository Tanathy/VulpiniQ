// Name: closest
// Method: Prototype
// Desc: Returns the closest parent node of the first node that matches a specific selector.
// Type: Traversal
// Example: Q(selector).closest(".parent");
// Variables: selector, el
Q.Ext('closest', selector => {
    let el = this.nodes[0];
    while (el) {
        if (el.matches && el.matches(selector)) {
            return new Q(el);
        }
        el = el.parentElement;
    }
    return null;
});