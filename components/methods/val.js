// Name: val
// Method: Prototype
// Desc: Gets or sets the value of form elements in the nodes.
// Type: Form Manipulation
// Example: Q(selector).val(value);
// Variables: val, el
Q.Ext('val', function (val) {
    if (val === undefined) {
        return this.nodes[0]?.value || null;
    }
    return this.each(el => this.nodes[el].value = val);
});