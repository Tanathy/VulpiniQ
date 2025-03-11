// Name: map
// Method: Prototype
// Desc: Maps each node to a new array.
// Type: Array
// Example: Q(selector).map(el => el.innerHTML);
// Variables: callback, result, el
Q.Ext('map', function (callback) {
    const result = [];
    for (const node of this.nodes) {
        result.push(callback(new Q(node)));
    }
    return result;
});