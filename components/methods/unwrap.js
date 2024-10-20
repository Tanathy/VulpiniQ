// Name: unwrap
// Method: Prototype
// Desc: Removes the parent wrapper of each node.
// Type: DOM Manipulation
// Example: Q(selector).unwrap();
// Variables: parent, el
Q.Ext('unwrap', function () {
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        if (parent !== document.body) {
            parent.replaceWith(...this.nodes);
        }
    });
});