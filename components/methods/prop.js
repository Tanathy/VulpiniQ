// Name: prop
// Method: Prototype
// Desc: Gets or sets a property on the nodes.
// Type: Property Manipulation
// Example: Q(selector).prop(property, value);
// Variables: property, value, el, index
Q.Ext('prop', function (property, value) {
    if (value === undefined) {
        return this.nodes[0]?.[property] || null;
    }
    return this.each(function (index, el) {
        el[property] = value;
    });
});