// Name: index
// Method: Prototype
// Desc: Returns the index of the first node, or moves the node to a specific index within its parent.
// Type: Traversal
// Example: Q(selector).index(index);
// Variables: index, parent, siblings, position, target, el
Q.Ext('index', index => {
    if (index === undefined) {
        return Array.from(this.nodes[0].parentNode.children).indexOf(this.nodes[0]);
    }
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        const siblings = Array.from(parent.children);
        const position = siblings.indexOf(el);
        const target = siblings.splice(index, 1)[0];
        if (position < index) {
            parent.insertBefore(target, el);
        } else {
            parent.insertBefore(target, this.nodes[el].nextSibling);
        }
    });
});