// Name: val
// Method: Prototype
// Desc: Gets or sets the value of form elements in the nodes.
// Type: Form Manipulation
// Example: Q(selector).val(value);
// Variables: input
Q.Ext('val', function(input) {
    if (input === undefined) return this.nodes[0]?.value || null;
    for (const node of this.nodes) {
        node.value = input;
    }
    return this;
  });
