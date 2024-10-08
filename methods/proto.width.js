// Name: width
// Method: Prototype
// Desc: Gets or sets the width of the first node.
// Type: Dimensions
// Example: Q(selector).width(value);
Q.prototype.width = function (value) {
    if (value === undefined) {
        return this.nodes[0].offsetWidth;
    }
    return this.each(el => this.nodes[el].style.width = value);
};