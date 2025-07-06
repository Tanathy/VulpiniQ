/**
 * @metadata
 * {
 *   "name": "closest",
 *   "method": "closest(selector)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Traverses up the DOM tree from the first element to find the closest ancestor that matches the given selector.",
 *   "longDesc": "This method traverses up the DOM tree from the first element in the current selection to find the closest ancestor element that matches the specified CSS selector. It uses the native matches() method for selector matching and returns a new Q object containing the matching ancestor element. If no matching ancestor is found, it returns null.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "Q('.item').closest('.container');",
 *     "Q('button').closest('form');"
 *   ],
 *   "flaws": "Only works with first element, returns null instead of empty Q object",
 *   "optimizations": "Add support for multiple elements, return consistent Q object",
 *   "performance": "O(h) where h is the height of the DOM tree"
 * }
 */
Q.Method('closest', function (selector) {
    let node = this.nodes[0];
    while (node) {
        if (node.matches && node.matches(selector)) {
            return new Q(node);
        }
        node = node.parentElement;
    }
    return null;
});
