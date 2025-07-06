/**
 * @metadata
 * {
 *   "name": "next",
 *   "method": "next(selector)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Traversal",
 *   "desc": "Gets the next sibling elements, optionally filtered by selector.",
 *   "longDesc": "This method returns a new Q instance containing the next sibling elements of each element in the current selection. An optional CSS selector can be provided to filter the results to only those siblings that match the selector. The method uses nextElementSibling to skip text nodes and only return element nodes. If no next sibling exists or matches the selector, it won't be included in the result.",
 *   "dependencies": [],
 *   "variables": [
 *     "result",
 *     "node",
 *     "next",
 *     "instance",
 *     "i",
 *     "n"
 *   ],
 *   "examples": [
 *     "Q('.item').next();",
 *     "Q('#current').next('.target');",
 *     "Q('li').next('li.active');"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses nextElementSibling for efficient sibling traversal, optional selector filtering",
 *   "performance": "Efficient sibling traversal with native DOM properties"
 * }
 */
Q.Method('next', function(selector) {
    const result = [];
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = this.nodes[i];
        let next = node.nextElementSibling;
        if (next && (!selector || next.matches(selector))) {
            result.push(next);
        }
    }
    const instance = new Q();
    instance.nodes = result;
    return instance;
});
