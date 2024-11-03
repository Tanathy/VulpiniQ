// Name: index
// Method: Prototype
// Desc: Returns the index of the first node, or moves the node to a specific index within its parent.
// Long Desc: This method provides two functionalities: if no index is specified, it returns the index of the first node among its siblings; if an index is provided, it moves the node to the specified index within its parent element. This allows for easy manipulation of DOM nodes within their parent context.
// Type: Traversal
// Example: const idx = Q(selector).index(); // Retrieves the index of the first selected node among its siblings <br> Q(selector).index(2); // Moves the first selected node to the index position 2 within its parent
// Variables: index, parent, siblings, position, target, el
Q.Ext('index', function (index) {
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