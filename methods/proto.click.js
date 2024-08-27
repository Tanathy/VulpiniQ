Q.prototype.click = function () {
    // Triggers a click event on each node.|Event Handling|Q(selector).click();
    return this.each(el => this.nodes[el].click());
};