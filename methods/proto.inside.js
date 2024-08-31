// Name: inside
// Method: Prototype
// Desc: Checks if the first node is inside another node.
// Type: Traversal
// Example: Q(selector).inside(".parent");
Q.prototype.inside = function (selector) {
    return this.nodes[0]?.closest(selector) !== null;
};