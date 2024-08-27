Q.prototype.blur = function () {
    // Blurs the first node.|Form Manipulation|Q(selector).blur();
    return this.each(el => this.nodes[el].blur());
};