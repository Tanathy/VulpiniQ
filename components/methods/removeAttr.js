// Name: removeAttr
// Method: Prototype
// Desc: Removes an attribute from each node.
// Type: Attribute Manipulation
// Example: Q(selector).removeAttr(attribute);
// Variables: attribute, el
Q.Ext('removeAttr', function (attribute) {
    for (const node of this.nodes) {
        node.removeAttribute(attribute);
    }
    return this;
});