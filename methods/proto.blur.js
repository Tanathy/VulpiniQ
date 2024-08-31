// Name: blur
// Method: Prototype
// Desc: Blurs the first node.
// Type: Form Manipulation
// Example: Q(selector).blur();
Q.prototype.blur = function () {
    return this.each(el => this.nodes[el].blur());
};