/**
 * @metadata
 * {
 *   "name": "width",
 *   "method": "width(value)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "dimensions",
 *   "desc": "Gets the width of the first element or sets the width of all elements. Returns offsetWidth when getting, Q object when setting.",
 *   "longDesc": "This method allows getting or setting the width of elements. When called without arguments, it returns the offsetWidth of the first element in the selection. When called with a value, it sets the width CSS property of all selected elements. The method supports both numeric values and string values with units.",
 *   "dependencies": [],
 *   "variables": ["value"],
 *   "examples": [
 *     "const width = Q('.box').width()",
 *     "Q('.item').width('200px')"
 *   ],
 *   "flaws": "Gets from first element only, Does not handle unit conversion",
 *   "optimizations": "Add unit handling, Add option to get all widths",
 *   "performance": "O(1) for getting, O(n) for setting where n is number of elements"
 * }
 */
Q.Method('width', function (value) {
    if (typeof value === 'undefined') {
        return this.nodes[0] ? this.nodes[0].offsetWidth : undefined;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.width = value;
    }
    return this;
});
