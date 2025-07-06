/**
 * @metadata
 * {
 *   "name": "prev",
 *   "method": "prev(selector)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Traversal",
 *   "desc": "Gets the previous sibling elements, optionally filtered by selector.",
 *   "longDesc": "This method returns a new Q instance containing the previous sibling elements of each element in the current selection. An optional CSS selector can be provided to filter the results to only those siblings that match the selector. The method uses previousElementSibling to skip text nodes and only return element nodes. If no previous sibling exists or matches the selector, it won't be included in the result.",
 *   "dependencies": [],
 *   "variables": [
 *     "result",
 *     "node",
 *     "previous",
 *     "instance",
 *     "i",
 *     "n"
 *   ],
 *   "examples": [
 *     "Q('.item').prev();",
 *     "Q('#current').prev('.target');",
 *     "Q('li').prev('li.completed');"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses previousElementSibling for efficient sibling traversal, optional selector filtering",
 *   "performance": "Efficient sibling traversal with native DOM properties"
 * }
 */
Q.Method('prev', function(selector) {
    const result = [];
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = this.nodes[i];
        let previous = node.previousElementSibling;
        if (previous && (!selector || previous.matches(selector))) {
            result.push(previous);
        }
    }
    const instance = new Q();
    instance.nodes = result;
    return instance;
});
