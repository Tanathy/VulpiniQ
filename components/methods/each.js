// Name: each
// Method: Prototype
// Desc: Iterates over all nodes in the Q object and executes a callback on each node, providing access to the index and element.
// Long Desc: This method allows you to perform an operation on each node contained within the Q object. The provided callback function is executed for every node, receiving the index and the corresponding element as arguments. This facilitates bulk operations or manipulations on selected nodes efficiently.
// Type: Iteration
// Example: Q(selector).each((index, element) => console.log(index, element)); // Logs the index and element for each node in the selection <br> Q(selector).each((index, element) => element.style.color = 'red'); // Changes the text color to red for each selected element
// Variables: callback, el, index
Q.Ext('each', function (callback) {
    if (!this.nodes) return this;
    this.nodes.forEach((el, index) => callback.call(el, index, el));
    return this;
});
