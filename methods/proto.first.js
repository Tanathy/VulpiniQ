// Name: first
// Method: Prototype
// Desc: Returns the first node.
// Type: Traversal
// Example: Q(selector).first();
Q.prototype.first = function () {
    return new Q(this.nodes[0]);
};