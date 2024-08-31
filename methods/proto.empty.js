// Name: empty
// Method: Prototype
// Desc: Empties the innerHTML of each node.
// Type: Content Manipulation
// Example: Q(selector).empty();
Q.prototype.empty = function () {
    return this.each(el => this.nodes[el].innerHTML = '');
};