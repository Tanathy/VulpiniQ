/**
 * @metadata
 * {
 *   "name": "map",
 *   "method": "map(callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Creates a new array with results of calling the callback on each element. Each element is wrapped in a Q object before passing to callback.",
 *   "longDesc": "This method creates a new array by calling the provided callback function for each element in the selection. Each element is wrapped in a Q object before being passed to the callback, allowing for method chaining within the callback. The callback's return values are collected into a new array which is returned by the method.",
 *   "dependencies": [],
 *   "variables": ["result", "nodes"],
 *   "examples": [
 *     "const texts = Q('.items').map(el => el.text());",
 *     "const heights = Q('.boxes').map(el => el.height());"
 *   ],
 *   "flaws": "Creates new Q objects for each element which may be inefficient, does not provide index parameter to callback",
 *   "optimizations": "Add index parameter, allow direct element access option",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('map', function (callback) {
    var result = [],
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        result.push(callback(new Q(nodes[i])));
    }
    return result;
});
