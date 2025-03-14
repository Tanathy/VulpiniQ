// Name: width
// Method: Prototype
// Desc: Gets or sets the width of the first node.
// Long Desc: If no value is passed, it returns the width of the first node. If a value is passed, it sets the width of all nodes.
// Type: Dimensions
// Example: Q(selector).width(value);
// Variables: value, el
Q.Ext('width', function (value) {
    if (typeof value === 'undefined') {
        return this.nodes[0] ? this.nodes[0].offsetWidth : undefined;
    }
    this.nodes.forEach(node => {
        node.style.width = value;
    });
    return this;
});