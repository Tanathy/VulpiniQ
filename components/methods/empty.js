// Name: empty
// Method: Prototype
// Desc: Empties the innerHTML of each node.
// Type: Content Manipulation
// Example: Q(selector).empty();
// Variables: el
Q.Ext('empty', function () {
    for (const node of this.nodes) node.innerHTML = '';
    return this;
  });
  