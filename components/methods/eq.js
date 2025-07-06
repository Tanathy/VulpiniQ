/**
 * @metadata
 * {
 *   "name": "eq",
 *   "method": "eq(index)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Returns a new Q object containing the element at the specified index, or null if the index is out of bounds.",
 *   "longDesc": "This method returns a new Q object containing only the element at the specified index position from the current selection. If the index is out of bounds, it returns null. The index is zero-based, so the first element is at index 0. This is useful for selecting a specific element from a collection.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "Q('li').eq(0);",
 *     "Q('.items').eq(2);"
 *   ],
 *   "flaws": "Returns null instead of empty Q object, does not support negative indexing",
 *   "optimizations": "Return empty Q object for consistency, add negative index support",
 *   "performance": "O(1)"
 * }
 */
Q.Method('eq', function (index) {
  var node = this.nodes[index];
  return node ? new Q(node) : null;
});
