// Name: wrap
// Method: Prototype
// Desc: Wraps each node with the specified wrapper element.
// Type: DOM Manipulation
// Example: Q(selector).wrap("<div class='wrapper'></div>");
Q.prototype.wrap = function (wrapper) {
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        const newParent = typeof wrapper === 'string' ? document.createElement(wrapper) : wrapper;
        parent.insertBefore(newParent, this.nodes[el]);
        newParent.appendChild(this.nodes[el]);
    });
};