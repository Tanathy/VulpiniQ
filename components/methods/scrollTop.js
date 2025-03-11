// Name: scrollTop
// Method: Prototype
// Desc: Gets or sets the vertical scroll position of the first node, with an option to increment.
// Type: Scroll Manipulation
// Example: Q(selector).scrollTop(value, increment);
// Variables: value, increment, maxScrollTop, el
Q.Ext('scrollTop', function (value, increment) {
    if (value === undefined) {
        return this.nodes[0].scrollTop;
    }
    return this.each(index => {
        const node = this.nodes[index];
        const maxScrollTop = node.scrollHeight - node.clientHeight;
        if (increment) {
            node.scrollTop = Math.min(node.scrollTop + value, maxScrollTop);
        } else {
            node.scrollTop = Math.min(value, maxScrollTop);
        }
    });
});