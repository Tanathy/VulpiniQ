/**
 * @metadata
 * {
 *   "name": "removeProp",
 *   "method": "removeProp(property)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "properties",
 *   "desc": "Removes a property from all elements in the set by setting it to undefined.",
 *   "longDesc": "This method removes the specified property from all elements in the current selection by setting the property value to undefined. This is particularly useful for cleaning up custom properties that were previously set on DOM elements. Note that this removes the property from the element object, not HTML attributes.",
 *   "dependencies": [],
 *   "variables": ["property"],
 *   "examples": [
 *     "Q('input').removeProp('customProp');",
 *     "Q('.element').removeProp('tempData');"
 *   ],
 *   "flaws": "No validation for property existence, delete operator can be slow",
 *   "optimizations": "Add existence check, use undefined assignment instead",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('removeProp', function (property) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        delete this.nodes[i][property];
    }
    return this;
});
