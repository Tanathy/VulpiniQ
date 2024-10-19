// Name: walk
// Method: Prototype
// Desc: Walks through all nodes in the Q object and executes a callback on each node, passing the current node as a Q object or raw element based on the boolean parameter.
// Type: Iteration
// Example: Q(selector).walk((node) => console.log(node), true); // Passes Q object
// Variables: callback, useQObject, node, index, el
Q.Ext('walk', (callback, useQObject = false) => {
    this.nodes.forEach((el, index) => {
        const node = useQObject ? Q(el) : el;
        callback.call(el, node, index);
    });
    return this;
});