// Name: scrollWidth
// Method: Prototype
// Desc: Returns the scroll width of the first node.
// Type: Dimensions
// Example: Q(selector).scrollWidth();
Q.Ext('scrollWidth', () => {
    return this.nodes[0].scrollWidth;
});