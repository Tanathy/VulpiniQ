Q.prototype.closest = function (selector) {
    // Returns the closest parent node of the first node that matches a specific selector.|Traversal|Q(selector).closest(".parent");
    let el = this.nodes[0];
    while (el) {
        if (el.matches && el.matches(selector)) {
            return new Q(el);
        }
        el = el.parentElement;
    }
    return null;
};