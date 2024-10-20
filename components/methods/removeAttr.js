// Name: removeAttr
// Method: Prototype
// Desc: Removes an attribute from each node.
// Type: Attribute Manipulation
// Example: Q(selector).removeAttr(attribute);
// Variables: attribute, el
Q.Ext('removeAttr', function (attribute) {
    return this.each(el => this.nodes[el].removeAttribute(attribute));
});