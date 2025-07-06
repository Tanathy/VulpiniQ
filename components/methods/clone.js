/**
 * @metadata
 * {
 *   "name": "clone",
 *   "method": "clone()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "manipulation",
 *   "desc": "Creates a deep clone of the first element in the set and returns it as a new Q object.",
 *   "longDesc": "This method creates a deep clone of the first element in the current selection, including all child elements and their attributes. The cloned element is returned as a new Q object, allowing for further manipulation. Note that event handlers are not cloned and must be reattached to the cloned element if needed.",
 *   "dependencies": [],
 *   "variables": [],
 *   "examples": [
 *     "Q('.template').clone();",
 *     "const cloned = Q('#original').clone();"
 *   ],
 *   "flaws": "Only clones the first element, does not preserve event handlers",
 *   "optimizations": "Add option to clone all elements, add event handler preservation",
 *   "performance": "O(n) where n is the size of the DOM subtree being cloned"
 * }
 */
Q.Method('clone', function () {
    return new Q(this.nodes[0].cloneNode(true));
});
