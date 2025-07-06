/**
 * @metadata
 * {
 *   "name": "removeData",
 *   "method": "removeData(key)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "attributes",
 *   "desc": "Removes data attributes from all elements in the set using the dataset API.",
 *   "longDesc": "This method removes the specified data attribute from all elements in the current selection using the native dataset API. It automatically handles the conversion between camelCase JavaScript property names and kebab-case HTML attribute names. When a data attribute is removed, it is completely eliminated from the element's dataset.",
 *   "dependencies": [],
 *   "variables": ["key"],
 *   "examples": [
 *     "Q('.item').removeData('id');",
 *     "Q('.element').removeData('temp');"
 *   ],
 *   "flaws": "No validation for key existence, uses delete operator which can be slow",
 *   "optimizations": "Add existence check, use setAttribute with null value",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('removeData', function (key) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        delete this.nodes[i].dataset[key];
    }
    return this;
});
