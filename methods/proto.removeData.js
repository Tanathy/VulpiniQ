// Name: removeData
// Method: Prototype
// Desc: Removes a data-* attribute from each node.
// Type: Data Manipulation
// Example: Q(selector).removeData(key);
Q.prototype.removeData = function (key) {
    return this.each(el => delete this.nodes[el].dataset[key]);
};