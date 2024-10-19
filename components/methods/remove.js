// Name: remove
// Method: Prototype
// Desc: Removes each node from the DOM.
// Type: DOM Manipulation
// Example: Q(selector).remove();
// Variables: el
Q.Ext('remove', () => {
    return this.each(el => this.nodes[el].remove());
});