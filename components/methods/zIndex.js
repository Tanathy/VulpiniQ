/**
 * @metadata
 * {
 *   "name": "zIndex",
 *   "method": "zIndex(value)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "style",
 *   "desc": "Gets or sets the z-index CSS property of elements. Returns the computed or inline z-index when getting, or the Q object when setting.",
 *   "longDesc": "This method allows getting or setting the z-index CSS property of elements. When called without arguments, it returns the z-index value of the first element, checking first the inline style and then the computed style. When called with a value, it sets the z-index property of all selected elements.",
 *   "dependencies": [],
 *   "variables": ["value", "node", "Index"],
 *   "examples": [
 *     "const zIndex = Q('.overlay').zIndex()",
 *     "Q('.modal').zIndex(1000)"
 *   ],
 *   "flaws": "Gets from first element only, Inconsistent return value handling, Variable naming inconsistency",
 *   "optimizations": "Consistent return values, Add number parsing, Improve variable naming",
 *   "performance": "O(1) for getting, O(n) for setting where n is number of elements"
 * }
 */
Q.Method('zIndex', function (value) {
    const node = this.nodes[0];
    if (!node) return;
    if (value === undefined) {
        let Index = node.style.zIndex || window.getComputedStyle(node).zIndex;
        return Index;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.zIndex = value;
    }
    return this;
});
