// Name: attr
// Method: Prototype
// Desc: Gets or sets attributes on the nodes, supporting multiple attributes at once.
// Long Desc: Gets or sets attributes on the nodes. If passed an object, it sets multiple attributes. If passed a string for the attribute and a value, it sets the attribute. If only the attribute name is given, it returns its value. Handles both single and multiple attribute operations.
// Type: Attribute Manipulation
// Example: Q(selector).attr("id", "newId"); // Sets the "id" attribute to "newId" <br> Q(selector).attr({ "src": "image.jpg", "alt": "An image" }); // Sets multiple attributes <br> Q(selector).attr("href"); // Gets the "href" attribute value
// Variables: attribute, value, key, el
Q.Ext('attr', function (attribute, value) {
    const nodes = this.nodes;
    if (typeof attribute === 'object') {
        for (const node of nodes) {
            for (const [key, val] of Object.entries(attribute)) {
                node.setAttribute(key, val);
            }
        }
        return this;
    } else {
        if (value === undefined) {
            return nodes[0] && nodes[0].getAttribute(attribute) || null;
        }
        for (const node of nodes) {
            node.setAttribute(attribute, value);
        }
        return this;
    }
});
