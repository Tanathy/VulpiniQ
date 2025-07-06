/**
 * @metadata
 * {
 *   "name": "parent",
 *   "method": "parent()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Traversal",
 *   "desc": "Gets the parent element of the first selected element.",
 *   "longDesc": "This method returns a new Q instance containing the parent element of the first element in the current selection. If the first element has no parent (such as the document element), it returns a Q instance containing null. This is useful for traversing up the DOM tree to access parent containers or wrapper elements.",
 *   "dependencies": [],
 *   "variables": [
 *     "node"
 *   ],
 *   "examples": [
 *     "Q('.child').parent();",
 *     "Q('#element').parent().addClass('parent-class');",
 *     "var parentDiv = Q('span').parent();"
 *   ],
 *   "flaws": "Only returns parent of the first element in selection",
 *   "optimizations": "Uses native parentNode property for efficient traversal",
 *   "performance": "Efficient parent traversal with native DOM property access"
 * }
 */
Q.Method('parent', function () {
    var node = this.nodes[0];
    return new Q(node ? node.parentNode : null);
});
