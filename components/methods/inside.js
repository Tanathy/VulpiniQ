// Name: inside
// Method: Prototype
// Desc: Checks if the first node is inside another node.
// Type: Traversal
// Example: Q(selector).inside(".parent");
// Variables: selector
Q.Ext('inside', selector => {
    return this.nodes[0]?.closest(selector) !== null;
});