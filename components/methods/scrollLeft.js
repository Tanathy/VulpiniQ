// Name: scrollLeft
// Method: Prototype
// Desc: Gets or sets the horizontal scroll position of the first node, with an option to increment.
// Type: Scroll Manipulation
// Example: Q(selector).scrollLeft(value, increment);
// Variables: value, increment, maxScrollLeft, el
Q.Ext('scrollLeft', (value, increment) => {
    if (value === undefined) {
        return this.nodes[0].scrollLeft;
    }
    return this.each(el => {
        const maxScrollLeft = this.nodes[el].scrollWidth - this.nodes[el].clientWidth;
        if (increment) {
            this.nodes[el].scrollLeft = Math.min(this.nodes[el].scrollLeft + value, maxScrollLeft);
        } else {
            this.nodes[el].scrollLeft = Math.min(value, maxScrollLeft);
        }
    });
});