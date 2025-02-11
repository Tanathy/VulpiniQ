// Name: walk
// Method: Prototype
// Desc: Walks through all nodes in the Q object and executes a callback on each node, passing the current node as a Q object or raw element based on the boolean parameter.
// Type: Iteration
// Example: Q(selector).walk((node) => console.log(node), true); // Passes Q object
// Variables: callback, useQObject, node, index
Q.Ext('walk', function (callback, useQObject = false) {
    this.nodes.forEach((element, index) => {
        const node = useQObject ? Q(element) : element;
        callback.call(element, node, index);
    });
    return this;
});
