Q.prototype.eq = function (index) {
    // Returns a specific node by index.|Traversal|Q(selector).eq(1);
    return new Q(this.nodes[index]);
};