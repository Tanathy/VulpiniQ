/**
 * @metadata
 * {
 *   "name": "removeAttr",
 *   "method": "removeAttr(attribute)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "attributes",
 *   "desc": "Removes the specified attribute from all elements in the set.",
 *   "longDesc": "This method removes the specified HTML attribute from all elements in the current selection. It uses the native removeAttribute() method to completely remove the attribute and its value from each element. This is useful for cleaning up temporary attributes or removing attributes that are no longer needed.",
 *   "dependencies": [],
 *   "variables": ["nodes", "attribute"],
 *   "examples": [
 *     "Q('.item').removeAttr('data-temp');",
 *     "Q('input').removeAttr('disabled');"
 *   ],
 *   "flaws": "No validation for attribute existence, does not handle multiple attributes",
 *   "optimizations": "Add multiple attribute support, add existence check",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('removeAttr', function (attribute) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].removeAttribute(attribute);
    }
    return this;
});
