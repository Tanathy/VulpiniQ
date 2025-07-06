/**
 * @metadata
 * {
 *   "name": "last",
 *   "method": "last()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Returns a new Q object containing only the last element from the current set.",
 *   "longDesc": "This method creates a new Q object containing only the last element from the current selection. It accesses the final element in the nodes array and returns it wrapped in a new Q instance. If the current selection is empty, it may return a Q object with undefined as the element.",
 *   "dependencies": [],
 *   "variables": ["nodes"],
 *   "examples": [
 *     "Q('li').last();",
 *     "Q('.items').last();"
 *   ],
 *   "flaws": "May return Q object with undefined if no elements, does not check if elements exist",
 *   "optimizations": "Add existence check, return empty Q object if no elements",
 *   "performance": "O(1)"
 * }
 */
Q.Method('last', function () {
    var nodes = this.nodes;
    return new Q(nodes[nodes.length - 1]);
});
