/**
 * @metadata
 * {
 *   "name": "position",
 *   "method": "position()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "dimensions",
 *   "desc": "Returns the position of the first element relative to its offset parent (position:relative parent).",
 *   "longDesc": "This method returns an object containing the top and left coordinates of the first element relative to its offset parent. It uses the native offsetTop and offsetLeft properties to provide positioning coordinates relative to the nearest positioned ancestor element. The returned object contains 'top' and 'left' properties representing pixel values.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "const pos = Q('.element').position();",
 *     "const {top, left} = Q('#box').position();"
 *   ],
 *   "flaws": "Only works with first element, does not account for margins",
 *   "optimizations": "Add support for all elements, include margin calculations",
 *   "performance": "O(1)"
 * }
 */
Q.Method('position', function () {
    var node = this.nodes[0];
    return {
        top: node.offsetTop,
        left: node.offsetLeft
    };
});
