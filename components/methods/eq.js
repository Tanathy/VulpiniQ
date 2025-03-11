// Name: eq
// Method: Prototype
// Desc: Returns a specific node by index.
// Type: Traversal
// Example: Q(selector).eq(1);
// Variables: index
Q.Ext('eq', function (index) {
  const node = this.nodes[index];
  return node ? new Q(node) : null;
});