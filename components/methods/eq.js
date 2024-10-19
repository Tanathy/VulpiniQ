// Name: eq
// Method: Prototype
// Desc: Returns a specific node by index.
// Type: Traversal
// Example: Q(selector).eq(1);
// Variables: index
Q.Ext('eq', index => {
    return new Q(this.nodes[index]);
});