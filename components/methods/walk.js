/**
 * @metadata
 * {
 *   "name": "walk",
 *   "method": "walk(callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "iteration",
 *   "desc": "Iterates over all elements in the set, calling the callback function for each. Optionally wraps elements in Q objects.",
 *   "longDesc": "This method iterates over all elements in the current selection, calling the provided callback function for each element. The callback receives the element (either as DOM element or wrapped in Q object) and the index as parameters. The useQObject parameter determines whether elements are passed as raw DOM elements or wrapped in Q objects.",
 *   "dependencies": [],
 *   "variables": ["callback", "useQObject", "node"],
 *   "examples": [
 *     "Q('.items').walk((el, i) => console.log(el, i))",
 *     "Q('.items').walk((qEl, i) => qEl.addClass('processed'), true)"
 *   ],
 *   "flaws": "useQObject parameter is confusing, Creates new Q objects unnecessarily",
 *   "optimizations": "Separate methods for different iteration types, Cache Q objects",
 *   "performance": "O(n) where n is number of elements, O(n*m) if useQObject is true"
 * }
 */
Q.Method('walk', function (callback, useQObject = false) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = useQObject ? Q(this.nodes[i]) : this.nodes[i];
        callback.call(this.nodes[i], node, i);
    }
    return this;
});
