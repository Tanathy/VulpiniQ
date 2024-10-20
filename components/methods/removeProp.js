// Name: removeProp
// Method: Prototype
// Desc: Removes a property from each node.
// Type: Property Manipulation
// Example: Q(selector).removeProp(property);
// Variables: property, el
Q.Ext('removeProp', function (property) {
    return this.each(el => delete this.nodes[el][property]);
});