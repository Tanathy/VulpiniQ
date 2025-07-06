/**
 * @metadata
 * {
 *   "name": "siblings",
 *   "method": "siblings(selector)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Traversal",
 *   "desc": "Gets all sibling elements, optionally filtered by selector.",
 *   "longDesc": "This method returns a new Q instance containing all sibling elements of each element in the current selection, excluding the elements themselves. An optional CSS selector can be provided to filter the results to only those siblings that match the selector. The method finds all children of each element's parent, then excludes the element itself from the results.",
 *   "dependencies": [],
 *   "variables": [
 *     "result",
 *     "node",
 *     "parent",
 *     "children",
 *     "instance",
 *     "i",
 *     "n",
 *     "j"
 *   ],
 *   "examples": [
 *     "Q('.item').siblings();",
 *     "Q('#current').siblings('.other');",
 *     "Q('li').siblings('li.inactive');"
 *   ],
 *   "flaws": "May include duplicate siblings if multiple elements have the same parent",
 *   "optimizations": "Uses parent.children for efficient sibling collection, optional selector filtering",
 *   "performance": "Efficient sibling collection through parent element traversal"
 * }
 */
Q.Method('siblings', function(selector) {
    const result = [];
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = this.nodes[i];
        const parent = node.parentNode;
        if (parent) {
            const children = parent.children;
            for (let j = 0; j < children.length; j++) {
                if (children[j] !== node) {
                    if (!selector || children[j].matches(selector)) {
                        result.push(children[j]);
                    }
                }
            }
        }
    }
    const instance = new Q();
    instance.nodes = result;
    return instance;
});
