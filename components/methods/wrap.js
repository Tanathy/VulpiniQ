// Name: wrap
// Method: Prototype
// Desc: Wraps each node with the specified wrapper element.
// Long Desc: The wrap() method wraps each element in the set of matched elements with the specified wrapper element.
// Type: DOM Manipulation
// Example: Q(selector).wrap("<div class='wrapper'></div>");
// Variables: wrapper, parentNode, newParentElement, tempDiv, div, node
Q.Ext('wrap', function (wrapper) {
    return this.each(node => {
        const parentNode = node.parentNode;
        let newParentElement = typeof wrapper === 'string'
            ? // Create and clone the wrapper so each node gets its own instance.
              ((tempDiv => (tempDiv.innerHTML = wrapper.trim(), tempDiv.firstElementChild.cloneNode(true)))
              (document.createElement('div')))
            : wrapper;
        parentNode.insertBefore(newParentElement, node);
        newParentElement.appendChild(node);
    });
});
