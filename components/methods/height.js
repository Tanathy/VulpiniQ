// Name: height
// Method: Prototype
// Desc: Gets or sets the height of the first node.
// Type: Dimensions
// Example: Q(selector).height(value);
// Variables: value, el
Q.Ext('height', function (value) {
    if (value === undefined) {
        return this.nodes[0].offsetHeight;
    }
    return this.each(el => this.nodes[el].style.height = value);
});