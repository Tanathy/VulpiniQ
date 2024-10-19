// Name: prepend
// Method: Prototype
// Desc: Prepends child nodes or HTML to each node.
// Type: DOM Manipulation
// Example: Q(selector).prepend("<div>Prepended</div>");
// Variables: nodes, parent, child, subchild, el
Q.Ext('prepend', (...nodes) => {
    return this.each(el => {
        const parent = this.nodes[el];

        nodes.forEach(child => {
            if (typeof child === 'string') {
                parent.insertAdjacentHTML('afterbegin', child);
            } else if (child instanceof HTMLElement || child instanceof Q) {
                parent.insertBefore(child.nodes[0], parent.firstChild);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                Array.from(child).forEach(subchild => parent.insertBefore(subchild, parent.firstChild));
            }
        });
    });
});