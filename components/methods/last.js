// Name: last
// Method: Prototype
// Desc: Returns the last node.
// Type: Traversal
// Example: Q(selector).last();
Q.Ext('last', function () {
    const nodes = this.nodes;
    return new Q(nodes[nodes.length - 1]);
});