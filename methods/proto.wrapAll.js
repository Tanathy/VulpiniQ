Q.prototype.wrapAll = function (wrapper) {
    // Wraps all nodes together in a single wrapper element.|DOM Manipulation|Q(selector).wrapAll("<div class="wrapper"></div>");
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        const newParent = typeof wrapper === 'string' ? document.createElement(wrapper) : wrapper;
        parent.insertBefore(newParent, this.nodes[0]);
        this.nodes.forEach(child => newParent.appendChild(child));
    });
};