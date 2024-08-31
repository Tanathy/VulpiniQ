// Name: scrollTop
// Method: Prototype
// Desc: Gets or sets the vertical scroll position of the first node, with an option to increment.
// Type: Dimensions
// Example: Q(selector).scrollTop(value, increment);
Q.prototype.scrollTop = function (value, increment = false) {
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
};