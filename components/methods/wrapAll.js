/**
 * @metadata
 * {
 *   "name": "wrapAll",
 *   "method": "wrapAll(wrapper)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "manipulation",
 *   "desc": "Wraps all elements in the set together with a single wrapper element. All elements are moved into the same wrapper.",
 *   "longDesc": "This method wraps all selected elements together with a single wrapper element. Unlike the wrap method which creates a separate wrapper for each element, wrapAll groups all elements inside one wrapper. The wrapper can be provided as an HTML string or as a DOM element. All selected elements are moved into the wrapper, which is inserted at the position of the first element.",
 *   "dependencies": [],
 *   "variables": ["wrapper", "parent", "newParent", "tempDiv"],
 *   "examples": [
 *     "Q('.items').wrapAll('<div class=\"container\"></div>')",
 *     "Q('li').wrapAll(document.createElement('ul'))"
 *   ],
 *   "flaws": "Uses complex inline function for string parsing, Assumes elements have same parent",
 *   "optimizations": "Simplify string parsing, Add parent validation",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('wrapAll', function (wrapper) {
    if (!this.nodes.length) return this;
    const parent = this.nodes[0].parentNode;
    let newParent = typeof wrapper === 'string'
        ? ((tempDiv => (tempDiv.innerHTML = wrapper.trim(), tempDiv.firstElementChild))
           (document.createElement('div')))
        : wrapper;
    parent.insertBefore(newParent, this.nodes[0]);
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        newParent.appendChild(this.nodes[i]);
    }
    return this;
});
