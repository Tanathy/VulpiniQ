// Name: removeAttr
// Method: Prototype
// Desc: Removes an attribute from each node.
// Type: Attribute Manipulation
// Example: Q(selector).removeAttr(attribute);
Q.prototype.removeAttr = function (attribute) {
    return this.each(el => this.nodes[el].removeAttribute(attribute));
};