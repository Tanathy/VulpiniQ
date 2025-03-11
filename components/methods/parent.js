// Name: parent
// Method: Prototype
// Desc: Returns the parent node of the first node.
// Type: Traversal
// Example: Q(selector).parent();
Q.Ext('parent', function () {
    const node = this.nodes[0];
    return new Q(node ? node.parentNode : null);
});