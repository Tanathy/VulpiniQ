// Name: width
// Method: Prototype
// Desc: Gets or sets the width of the first node.
// Type: Dimensions
// Example: Q(selector).width(value);
// Variables: value, el
Q.Ext('width', function (value) {
    if (value === undefined) {
        return this.nodes[0].offsetWidth;
    }
    return this.each(el => this.nodes[el].style.width = value);
});