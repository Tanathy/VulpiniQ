// Name: data
// Method: Prototype
// Desc: Retrieves or sets data-* attributes on the selected nodes. Provides an easy way to store and access custom data associated with the elements.
// Long Desc: This method allows you to interact with the data-* attributes of the selected nodes. If a value is provided, it sets the specified data-* attribute on each node. If no value is provided, it retrieves the value of the specified data-* attribute from the first node. This is useful for storing additional information related to elements without affecting their attributes directly.
// Type: Data Manipulation
// Example: Q(selector).data('userId', 123); // Sets the data-userId attribute to 123 on each selected element <br> const userId = Q(selector).data('userId'); // Retrieves the value of the data-userId attribute from the first selected element <br> const isActive = Q(selector).data('isActive'); // Retrieves the value of the data-isActive attribute, returns null if not set
// Variables: key, value, el
Q.Ext('data', function (key, value) {
    const nodes = this.nodes;
    if (value === undefined) {
        return nodes[0] && nodes[0].dataset[key] || null;
    }
    for (const node of nodes) {
        node.dataset[key] = value;
    }
    return this;
});
