// Name: blur
// Method: Prototype
// Desc: Blurs the first node.
// Type: Form Manipulation
// Example: Q(selector).blur();
// Variables: el
Q.Ext('blur', function () {
    return this.each(el => this.nodes[el].blur());
});