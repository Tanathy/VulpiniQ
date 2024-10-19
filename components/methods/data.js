// Name: data
// Method: Prototype
// Desc: Gets or sets data-* attributes on the nodes.
// Type: Data Manipulation
// Example: Q(selector).data(key, value);
// Variables: key, value, el
Q.Ext('data', (key, value) => {
    if (value === undefined) {
        return this.nodes[0]?.dataset[key] || null;
    }
    return this.each(el => this.nodes[el].dataset[key] = value);
});