Q.prototype.find = function (selector) {
    // Finds child nodes of the first node that match a specific selector.|Traversal|Q(selector).find(".child");
    const foundNodes = this.nodes[0].querySelectorAll(selector);
    return foundNodes.length ? Q(foundNodes) : null;
};