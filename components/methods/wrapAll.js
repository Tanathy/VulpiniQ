// Name: wrapAll
// Method: Prototype
// Desc: Wraps all nodes together in a single wrapper element.
// Long Desc: The wrapAll() method wraps all elements in the set of matched elements into a single wrapper element.
// Type: DOM Manipulation
// Example: Q(selector).wrapAll("<div class='wrapper'></div>");
// Variables: wrapper, parent, newParent, child, el
Q.Ext('wrapAll', function (wrapper) {
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        let newParent;
        if (typeof wrapper === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = wrapper.trim();
            newParent = tempDiv.firstElementChild;
        } else {
            newParent = wrapper;
        }
        parent.insertBefore(newParent, this.nodes[0]);
        this.nodes.forEach(child => newParent.appendChild(child));
    });
});