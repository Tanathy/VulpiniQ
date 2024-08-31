// Name: val
// Method: Prototype
// Desc: Gets or sets the value of form elements in the nodes.
// Type: Form Manipulation
// Example: Q(selector).val(value);
Q.prototype.val = function (value) {
    if (value === undefined) {
        return this.nodes[0]?.value || null;
    }
    return this.each(el => this.nodes[el].value = value);
};