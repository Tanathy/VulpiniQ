/**
 * @metadata
 * {
 *   "name": "offset",
 *   "method": "offset()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "dimensions",
 *   "desc": "Returns the current coordinates of the first element relative to the document, including scroll position.",
 *   "longDesc": "This method returns an object containing the top and left coordinates of the first element relative to the document. It uses getBoundingClientRect() and accounts for the document's scroll position to provide absolute positioning coordinates. The returned object contains 'top' and 'left' properties representing pixel values from the document's top-left corner.",
 *   "dependencies": [],
 *   "variables": ["node", "rect"],
 *   "examples": [
 *     "const pos = Q('.element').offset();",
 *     "const {top, left} = Q('#box').offset();"
 *   ],
 *   "flaws": "Only works with first element, may not work correctly in all browsers",
 *   "optimizations": "Add support for all elements, add browser compatibility checks",
 *   "performance": "O(1)"
 * }
 */
Q.Method('offset', function () {
    var node = this.nodes[0],
        rect = node.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
});
