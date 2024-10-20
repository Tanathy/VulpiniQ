// Name: id
// Method: Prototype
// Desc: Gets or sets the id attribute of the first node.
// Type: Attributes
// Example: Q(selector).id(); or Q(selector).id('new-id');
// Variables: ident
Q.Ext('id', function (ident) {
    if (ident === undefined) {
        return this.nodes[0].id;
    }

    return this.nodes[0].id = ident;
});