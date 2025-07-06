/**
 * @metadata
 * {
 *   "name": "first",
 *   "method": "first()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Returns a new Q object containing only the first element from the current set.",
 *   "longDesc": "This method creates a new Q object containing only the first element from the current selection. If the current selection is empty, it will return a Q object with undefined as the first element. This is useful for narrowing down a selection to work with just the first matched element.",
 *   "dependencies": [],
 *   "variables": [],
 *   "examples": [
 *     "Q('li').first();",
 *     "Q('.items').first();"
 *   ],
 *   "flaws": "May return Q object with undefined if no elements, does not check if element exists",
 *   "optimizations": "Add existence check, return empty Q object if no elements",
 *   "performance": "O(1)"
 * }
 */
Q.Method('first', function () {
    return new Q(this.nodes[0]);
});
