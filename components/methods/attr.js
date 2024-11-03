// Name: attr
// Method: Prototype
// Desc: Gets or sets attributes on the nodes, supporting multiple attributes at once.
// Long Desc: Gets or sets attributes on the nodes. If passed an object, it sets multiple attributes. If passed a string for the attribute and a value, it sets the attribute. If only the attribute name is given, it returns its value. Handles both single and multiple attribute operations.
// Type: Attribute Manipulation
// Example: Q(selector).attr("id", "newId"); // Sets the "id" attribute to "newId" <br> Q(selector).attr({ "src": "image.jpg", "alt": "An image" }); // Sets multiple attributes <br> Q(selector).attr("href"); // Gets the "href" attribute value
// Variables: attribute, value, key, el
Q.Ext('attr', function (attribute, value) {
    if (typeof attribute === 'object') {
        return this.each(el => {
            for (let key in attribute) {
                if (attribute.hasOwnProperty(key)) {
                    this.nodes[el].setAttribute(key, attribute[key]);
                }
            }
        });
    } else {
        if (value === undefined) {
            return this.nodes[0]?.getAttribute(attribute) || null;
        }
        return this.each(el => this.nodes[el].setAttribute(attribute, value));
    }
});
