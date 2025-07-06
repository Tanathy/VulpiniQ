/**
 * @metadata
 * {
 *   "name": "wrap",
 *   "method": "wrap(wrapper)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "manipulation",
 *   "desc": "Wraps each element in the set with the specified wrapper element. Supports HTML strings and DOM elements as wrappers.",
 *   "longDesc": "This method wraps each selected element with the specified wrapper element. The wrapper can be provided as an HTML string or as a DOM element. When using an HTML string, it's parsed and the first element is used as the wrapper. Each element gets its own wrapper instance, so the wrapper is cloned for each element.",
 *   "dependencies": [],
 *   "variables": ["wrapper", "node", "parent_Node", "newParentElement", "tempDiv"],
 *   "examples": [
 *     "Q('.item').wrap('<div class=\"wrapper\"></div>')",
 *     "Q('.content').wrap(document.createElement('section'))"
 *   ],
 *   "flaws": "Creates new wrapper for each element, Variable naming inconsistency",
 *   "optimizations": "Reuse wrapper elements where possible, Improve variable naming",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('wrap', function (wrapper) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = this.nodes[i];
        const parent_Node = node.parentNode;
        let newParentElement;
        if (typeof wrapper === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = wrapper.trim();
            newParentElement = tempDiv.firstElementChild.cloneNode(true);
        } else {
            newParentElement = wrapper;
        }
        parent_Node.insertBefore(newParentElement, node);
        newParentElement.appendChild(node);
    }
    return this;
});
