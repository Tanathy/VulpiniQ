/**
 * @metadata
 * {
 *   "name": "height",
 *   "method": "height(value)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "dimensions",
 *   "desc": "Gets the height of the first element or sets the height of all elements. Returns offsetHeight when getting, Q object when setting.",
 *   "longDesc": "This method provides dual functionality for element heights. When called without arguments, it returns the offsetHeight of the first element in pixels. When called with a value, it sets the CSS height property of all selected elements. The value can be any valid CSS height value including pixels, percentages, or other units.",
 *   "dependencies": [],
 *   "variables": ["nodes", "value"],
 *   "examples": [
 *     "const height = Q('.box').height();",
 *     "Q('.item').height('200px');"
 *   ],
 *   "flaws": "Gets from first element only, does not handle unit conversion",
 *   "optimizations": "Add unit handling, add option to get all heights",
 *   "performance": "O(1) for getting, O(n) for setting where n is number of elements"
 * }
 */
Q.Method('height', function (value) {
    var nodes = this.nodes;
    if (value === undefined) {
        return nodes[0].offsetHeight;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].style.height = value;
    }
    return this;
});
