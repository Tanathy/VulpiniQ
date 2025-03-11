// Name: remove
// Method: Prototype
// Desc: Removes each node from the DOM.
// Type: DOM Manipulation
// Example: Q(selector).remove();
// Variables: el
Q.Ext('remove', function() {
    for (const node of this.nodes) {
        node.remove();
    }
    return this;
});