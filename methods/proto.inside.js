Q.prototype.inside = function (selector) {
    // Checks if the first node is inside another node.|Traversal|Q(selector).inside(".parent");
    return this.nodes[0]?.closest(selector) === null || false;
};