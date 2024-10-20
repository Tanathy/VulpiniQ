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
    return this.each(el => {
        const maxScrollTop = this.nodes[el].scrollHeight - this.nodes[el].clientHeight;
        if (increment) {
            this.nodes[el].scrollTop = Math.min(this.nodes[el].scrollTop + value, maxScrollTop);
        } else {
            this.nodes[el].scrollTop = Math.min(value, maxScrollTop);
        }
    });
});