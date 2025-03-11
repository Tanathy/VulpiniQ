// Name: position
// Method: Prototype
// Desc: Returns the top and left position of the first node relative to its offset parent.
// Type: Dimension/Position
// Example: Q(selector).position();
Q.Ext('position', function () {
    const node = this.nodes[0];
    return {
        top: node.offsetTop,
        left: node.offsetLeft
    };
});