/**
 * @metadata
 * {
 *   "name": "scrollTop",
 *   "method": "scrollTop(value)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "dimensions",
 *   "desc": "Gets or sets the vertical scroll position of elements. Supports increment mode for relative scrolling with boundary checking.",
 *   "longDesc": "This method allows getting or setting the vertical scroll position of selected elements. When called without arguments, it returns the scrollTop value of the first element. When called with a value, it sets the scrollTop property of all selected elements. The increment parameter allows for relative scrolling with boundary checking to prevent scrolling beyond the maximum scroll height.",
 *   "dependencies": [],
 *   "variables": ["node", "value", "increment", "current", "maxScrollTop"],
 *   "examples": [
 *     "const scrollPos = Q('.container').scrollTop()",
 *     "Q('.container').scrollTop(200)",
 *     "Q('.container').scrollTop(50, true)"
 *   ],
 *   "flaws": "Gets from first element only, Complex parameter handling",
 *   "optimizations": "Separate methods for get/set/increment, Add smooth scrolling option",
 *   "performance": "O(1) for getting, O(n) for setting where n is number of elements"
 * }
 */
Q.Method('scrollTop', function (value, increment) {
    const node = this.nodes[0];
    if (value === undefined) {
        return node.scrollTop;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const current = this.nodes[i];
        const maxScrollTop = current.scrollHeight - current.clientHeight;
        current.scrollTop = increment 
            ? Math.min(current.scrollTop + value, maxScrollTop) 
            : Math.min(value, maxScrollTop);
    }
    return this;
});
