// Name: height
// Method: Prototype
// Desc: Gets or sets the height of the first node.
// Type: Dimensions
// Example: Q(selector).height(value);
// Variables: value, el
Q.Ext('height', function (value) {
    const nodes = this.nodes; // ...existing code...
    if (value === undefined) {
        return nodes[0].offsetHeight;
    }
    for (const node of nodes) {
        node.style.height = value;
    }
    return this;
});