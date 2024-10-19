// Name: clone
// Method: Prototype
// Desc: Clones the first node.
// Type: DOM Manipulation
// Example: Q(selector).clone();
Q.Ext('clone', () => {
    return new Q(this.nodes[0].cloneNode(true));
});