// Name: click
// Method: Prototype
// Desc: Triggers a click event on each node.
// Type: Event Handling
// Example: Q(selector).click();
Q.prototype.click = function () {
    return this.each(el => this.nodes[el].click());
};