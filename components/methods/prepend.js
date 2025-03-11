// Name: prepend
// Method: Prototype
// Desc: Prepends child nodes or HTML to each node.
// Type: DOM Manipulation
// Example: Q(selector).prepend("<div>Prepended</div>");
// Variables: nodes, parent, child, subchild, el
Q.Ext('prepend', function (...nodes) {
    for (const parent of this.nodes) {
        for (const child of nodes) {
            if (typeof child === 'string') {
                parent.insertAdjacentHTML('afterbegin', child);
            } else if (child instanceof Q) {
                parent.insertBefore(child.nodes[0], parent.firstChild);
            } else if (child instanceof HTMLElement || child instanceof Node) {
                parent.insertBefore(child, parent.firstChild);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                for (const subchild of Array.from(child)) {
                    parent.insertBefore(subchild, parent.firstChild);
                }
            }
        }
    }
    return this;
});