Q.prototype.removeAttr = function (attribute) {
    // Removes an attribute from each node.|Attribute Manipulation|Q(selector).removeAttr(attribute);
    return this.each(el => this.nodes[el].removeAttribute(attribute));
};