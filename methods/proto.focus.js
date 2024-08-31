// Name: focus
// Method: Prototype
// Desc: Focuses on the first node.
// Type: Form Manipulation
// Example: Q(selector).focus();
Q.prototype.focus = function () {
    return this.each(el => this.nodes[el].focus());
};