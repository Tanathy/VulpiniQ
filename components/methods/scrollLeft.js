// Name: scrollLeft
// Method: Prototype
// Desc: Gets or sets the horizontal scroll position of the first node, with an option to increment.
// Type: Scroll Manipulation
// Example: Q(selector).scrollLeft(value, increment);
// Variables: value, increment, maxScrollLeft, el
Q.Ext('scrollLeft', function (value, increment) {
    if (value === undefined) {
        return this.nodes[0].scrollLeft;
    }
    return this.each(index => {
        const node = this.nodes[index];
        const maxScrollLeft = node.scrollWidth - node.clientWidth;
        if (increment) {
            node.scrollLeft = Math.min(node.scrollLeft + value, maxScrollLeft);
        } else {
            node.scrollLeft = Math.min(value, maxScrollLeft);
        }
    });
});