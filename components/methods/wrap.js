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
      let newParentElement =
        typeof wrapper === 'string'
          ? ((tempDiv => tempDiv.firstElementChild)(((() => {
              const div = document.createElement('div');
              div.innerHTML = wrapper.trim();
              return div;
            })())))
          : wrapper;
      parentNode.insertBefore(newParentElement, node);
      newParentElement.appendChild(node);
    });
  });
