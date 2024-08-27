Q.prototype.empty = function () {
    // Empties the innerHTML of each node.|Content Manipulation|Q(selector).empty();
    return this.each(el => this.nodes[el].innerHTML = '');
};