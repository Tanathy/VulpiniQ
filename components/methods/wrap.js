// Name: wrap
// Method: Prototype
// Desc: Wraps each node with the specified wrapper element.
// Long Desc: The wrap() method wraps each element in the set of matched elements with the specified wrapper element.
// Type: DOM Manipulation
// Example: Q(selector).wrap("<div class='wrapper'></div>");
// Variables: parent, newParent, wrapper, el
Q.Ext('wrap', function (wrapper) {
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
        parent.insertBefore(newParent, this.nodes[el]);
        newParent.appendChild(this.nodes[el]);
    });
});