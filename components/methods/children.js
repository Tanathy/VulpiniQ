// Name: children
// Method: Prototype
// Desc: Retrieves the direct child nodes of the first node in the selection.
// Long Desc: This method returns a new Q object containing all the direct child nodes of the first matched element. This is useful for traversing the DOM and manipulating child elements directly.
// Type: Traversal
// Example: Q(selector).children(); // Returns all child nodes of the first matched element <br> Q("#parent").children(); // Gets all children of the element with id 'parent' <br> Q("ul").children(); // Retrieves all child nodes of the first unordered list
Q.Ext('children', function () {
    return new Q(this.nodes[0].children);
});
