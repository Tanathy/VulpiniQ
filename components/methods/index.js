// Name: index
// Method: Prototype
// Desc: Returns the index of the first node, or moves the node to a specific index within its parent.
// Long Desc: This method provides two functionalities: if no index is specified, it returns the index of the first node among its siblings; if an index is provided, it moves the node to the specified index within its parent element. This allows for easy manipulation of DOM nodes within their parent context.
// Type: Traversal
// Example: const idx = Q(selector).index(); // Retrieves the index of the first selected node among its siblings <br> Q(selector).index(2); // Moves the first selected node to the index position 2 within its parent
// Variables: index, parent, siblings, position, target, el
Q.Ext('index', function (index) {
    const first = this.nodes[0];
    if (index === undefined) {
        return Array.from(first.parentNode.children).indexOf(first);
    }
    for (const node of this.nodes) {
        const parent = node.parentNode;
        if (!parent) continue;
        const children = Array.from(parent.children);
        parent.removeChild(node);
        if (index >= children.length) {
            parent.appendChild(node);
        } else {
            parent.insertBefore(node, children[index]);
        }
    }
    return this;
});