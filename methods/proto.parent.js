Q.prototype.parent = function () {
    // Returns the parent node of the first node.|Traversal|Q(selector).parent();
    return new Q(this.nodes[0].parentNode);
};