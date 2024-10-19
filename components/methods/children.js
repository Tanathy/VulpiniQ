// Name: children
// Method: Prototype
// Desc: Returns the children of the first node.
// Type: Traversal
// Example: Q(selector).children();
Q.Ext('children', () => {
    return new Q(this.nodes[0].children);
});