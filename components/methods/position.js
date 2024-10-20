// Name: position
// Method: Prototype
// Desc: Returns the top and left position of the first node relative to its offset parent.
// Type: Dimension/Position
// Example: Q(selector).position();
Q.Ext('position', function () {
    return {
        top: this.nodes[0].offsetTop,
        left: this.nodes[0].offsetLeft
    };
});