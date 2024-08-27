Q.prototype.remove = function () {
    // Removes each node from the DOM.|DOM Manipulation|Q(selector).remove();
    return this.each(el => this.nodes[el].remove());
};