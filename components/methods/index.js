/**
 * @metadata
 * {
 *   "name": "index",
 *   "method": "index(position)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Gets the index of the first element among siblings, or moves all elements to the specified index position within their parent.",
 *   "longDesc": "This method provides dual functionality for element positioning. When called without arguments, it returns the zero-based index position of the first element among its siblings within the parent container. When called with a numeric position, it moves all selected elements to that index position within their respective parent containers, effectively reordering the DOM structure.",
 *   "dependencies": [],
 *   "variables": ["first", "nodes", "node", "parent", "children"],
 *   "examples": [
 *     "const position = Q('.item').index();",
 *     "Q('.item').index(2);"
 *   ],
 *   "flaws": "Moving elements may cause layout shifts, does not handle elements without parents",
 *   "optimizations": "Add batch movement optimization, add parent existence checks",
 *   "performance": "O(1) for getting, O(n*m) for setting where n is elements and m is siblings"
 * }
 */
Q.Method('index', function (index) {
    var first = this.nodes[0];
    if (index === undefined) {
        return Array.prototype.indexOf.call(first.parentNode.children, first);
    }
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i],
            parent = node.parentNode;
        if (!parent) continue;
        var children = Array.from(parent.children);
        parent.removeChild(node);
        if (index >= children.length) {
            parent.appendChild(node);
        } else {
            parent.insertBefore(node, children[index]);
        }
    }
    return this;
});
