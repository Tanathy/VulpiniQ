// Name: eq
// Method: Prototype
// Desc: Returns a specific node by index.
// Type: Traversal
// Example: Q(selector).eq(1);
Q.prototype.eq = function (index) {
    return new Q(this.nodes[index]);
};