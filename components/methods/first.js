// Name: first
// Method: Prototype
// Desc: Returns the first node.
// Type: Traversal
// Example: Q(selector).first();
Q.Ext('first', function () {
    return new Q(this.nodes[0]);
});