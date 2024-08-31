// Name: remove
// Method: Prototype
// Desc: Removes each node from the DOM.
// Type: DOM Manipulation
// Example: Q(selector).remove();
Q.prototype.remove = function () {
    return this.each(el => this.nodes[el].remove());
};