// Name: prop
// Method: Prototype
// Desc: Gets or sets a property on the nodes.
// Type: Property Manipulation
// Example: Q(selector).prop(property, value);
// Variables: property, value, el, index
Q.Ext('prop', function (property, value) {
    if (value === undefined) {
        return this.nodes[0] ? this.nodes[0][property] : null;
    }
    for (const node of this.nodes) {
        node[property] = value;
    }
    return this;
});