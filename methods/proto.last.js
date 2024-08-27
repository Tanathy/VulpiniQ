Q.prototype.last = function () {
    // Returns the last node.|Traversal|Q(selector).last();
    return new Q(this.nodes[this.nodes.length - 1]);
};