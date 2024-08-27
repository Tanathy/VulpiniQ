Q.prototype.children = function () {
    // Returns the children of the first node.|Traversal|Q(selector).children();
    return new Q(this.nodes[0].children);
};