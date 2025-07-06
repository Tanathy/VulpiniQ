/**
 * @metadata
 * {
 *   "name": "inside",
 *   "method": "inside(selector)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Checks if the first element is contained within an ancestor that matches the given selector.",
 *   "longDesc": "This method determines whether the first element in the selection is contained within an ancestor element that matches the specified CSS selector. It uses the native closest() method to traverse up the DOM tree and returns true if a matching ancestor is found, false otherwise. This is useful for checking element containment relationships.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "Q('.item').inside('.container');",
 *     "if (Q('button').inside('form')) { return; }"
 *   ],
 *   "flaws": "Only checks first element, relies on native closest method",
 *   "optimizations": "Add support for checking all elements, add custom traversal logic",
 *   "performance": "O(h) where h is the height of the DOM tree"
 * }
 */
Q.Method('inside', function (selector) {
    var node = this.nodes[0];
    return node ? node.closest(selector) !== null : false;
});
