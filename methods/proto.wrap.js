Q.prototype.wrap = function (wrapper) {
    // Wraps each node with the specified wrapper element.|DOM Manipulation|Q(selector).wrap("<div class="wrapper"></div>");
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        const newParent = typeof wrapper === 'string' ? document.createElement(wrapper) : wrapper;
        parent.insertBefore(newParent, this.nodes[el]);
        newParent.appendChild(this.nodes[el]);
    });
};