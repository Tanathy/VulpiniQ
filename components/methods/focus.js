// Name: focus
// Method: Prototype
// Desc: Focuses on the first node.
// Type: Form Manipulation
// Example: Q(selector).focus();
// Variables: el
Q.Ext('focus', () => {
    return this.each(el => this.nodes[el].focus());
});