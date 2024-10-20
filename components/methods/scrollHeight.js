// Name: scrollHeight
// Method: Prototype
// Desc: Returns the scroll height of the first node.
// Type: Scroll Manipulation
// Example: Q(selector).scrollHeight();
Q.Ext('scrollHeight', function () {
    return this.nodes[0].scrollHeight;
});