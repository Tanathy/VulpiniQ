// Name: removeProp
// Method: Prototype
// Desc: Removes a property from each node.
// Type: Property Manipulation
// Example: Q(selector).removeProp(property);
Q.prototype.removeProp = function (property) {
    return this.each(el => delete this.nodes[el][property]);
};