Q.prototype.focus = function () {
    // Focuses on the first node.|Form Manipulation|Q(selector).focus();
    return this.each(el => this.nodes[el].focus());
};