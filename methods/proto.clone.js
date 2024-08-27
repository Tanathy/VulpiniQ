Q.prototype.clone = function () {
    // Clones the first node.|DOM Manipulation|Q(selector).clone();
    return new Q(this.nodes[0].cloneNode(true));
};