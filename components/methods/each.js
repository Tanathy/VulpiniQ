// Name: each
// Method: Prototype
// Desc: Iterates over all nodes in the Q object and executes a callback on each node.
// Type: Iteration
// Example: Q(selector).each((index, element) => console.log(index, element));
// Variables: callback, el, index
Q.Ext('each', callback => {
    this.nodes.forEach((el, index) => callback.call(el, index, el));
    return this;
});