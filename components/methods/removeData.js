// Name: removeData
// Method: Prototype
// Desc: Removes a data-* attribute from each node.
// Type: Data Manipulation
// Example: Q(selector).removeData(key);
// Variables: key, el
Q.Ext('removeData', function (key) {
    return this.each(index => {
        const node = this.nodes[index];
        delete node.dataset[key];
    });
});