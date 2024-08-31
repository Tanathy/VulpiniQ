// Name: append
// Method: Prototype
// Desc: Appends child nodes or HTML to each node.
// Type: DOM Manipulation
// Example: Q(selector).append("<div>Appended</div>");
Q.prototype.append = function (...nodes) {
    return this.each(el => {
        const parent = this.nodes[el];

        nodes.forEach(child => {

            if (typeof child === 'string') {
                parent.insertAdjacentHTML('beforeend', child);
            } else if (child instanceof HTMLElement || child instanceof Q) {
                parent.appendChild(child.nodes[0]);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                Array.from(child).forEach(subchild => parent.appendChild(subchild));
            }
        });
    });
};