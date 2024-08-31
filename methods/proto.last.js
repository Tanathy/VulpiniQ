// Name: last
// Method: Prototype
// Desc: Returns the last node.
// Type: Traversal
// Example: Q(selector).last();
Q.prototype.last = function () {
    return new Q(this.nodes[this.nodes.length - 1]);
};