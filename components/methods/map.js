// Name: map
// Method: Prototype
// Desc: Maps each node to a new array.
// Type: Array
// Example: Q(selector).map(el => el.innerHTML);
// Variables: callback, result, el
Q.Ext('map', function (callback) {
    let result = [];
    this.each(el => result.push(callback(Q(el))));
    return result;
});