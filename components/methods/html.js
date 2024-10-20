// Name: html
// Method: Prototype
// Desc: Gets or sets the innerHTML of the nodes.
// Type: Content Manipulation
// Example: Q(selector).html(string);
// Variables: content, child, el, node, subchild
Q.Ext('html', function (content) {
    if (content === undefined) {
        return this.nodes[0]?.innerHTML || null;
    }
    return this.each(el => {
        el = this.nodes[el];
        el.innerHTML = '';
        content.forEach(child => {
            if (typeof child === 'string') {
                el.insertAdjacentHTML('beforeend', child);
            } else if (child instanceof Q) {
                child.nodes.forEach(node => el.appendChild(node));
            } else if (child instanceof HTMLElement) {
                el.appendChild(child);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                Array.from(child).forEach(subchild => el.appendChild(subchild));
            }
        });
    });
});