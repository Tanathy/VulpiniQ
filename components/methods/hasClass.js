/**
 * @metadata
 * {
 *   "name": "hasClass",
 *   "method": "hasClass(className)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "attributes",
 *   "desc": "Checks if the first element in the set has the specified CSS class name.",
 *   "longDesc": "This method checks whether the first element in the current selection contains the specified CSS class name. It uses the native classList.contains() method for efficient class checking. Returns true if the class is found, false otherwise. If no elements are selected, it returns false.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "Q('.item').hasClass('active');",
 *     "if (Q('#button').hasClass('disabled')) { return; }"
 *   ],
 *   "flaws": "Only checks first element, returns false for non-existent elements",
 *   "optimizations": "Add support for checking all elements, add multiple class support",
 *   "performance": "O(1)"
 * }
 */
Q.Method('hasClass', function(className) {
    var node = this.nodes[0];
    return (node && node.classList.contains(className)) || false;
});
