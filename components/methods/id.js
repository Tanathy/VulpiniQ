// Name: id
// Method: Prototype
// Desc: Gets or sets the id attribute of the first node. This provides a simple way to retrieve or modify the unique identifier of an element.
// Long Desc: This method allows you to access or change the id attribute of the first node in the Q object. If no argument is provided, it retrieves the current id value. If an id value is passed, it updates the id of the first node, making it easy to manage element identifiers in the DOM.
// Type: Attributes
// Example: const currentId = Q(selector).id(); // Retrieves the current id of the first selected element <br> Q(selector).id('new-id'); // Sets the id of the first selected element to 'new-id'
// Variables: ident
Q.Ext('id', function (ident) {
    if (ident === undefined) {
        return this.nodes[0].id;
    }

    return this.nodes[0].id = ident;
});
