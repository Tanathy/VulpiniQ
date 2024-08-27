Q.prototype.append = function (...nodes) {
    // Appends child nodes or HTML to each node.|DOM Manipulation|Q(selector).append("<div>Appended</div>");
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