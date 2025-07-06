/**
 * @metadata
 * {
 *   "name": "prop",
 *   "method": "prop(property, value)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "properties",
 *   "desc": "Gets or sets a property on DOM elements. Returns the property value when getting, or the Q object when setting.",
 *   "longDesc": "This method provides access to DOM element properties (not attributes). When called with just a property name, it returns the property value from the first element. When called with property and value, it sets the property on all selected elements. This is particularly useful for form elements where properties like 'checked', 'selected', or 'disabled' need to be manipulated.",
 *   "dependencies": [],
 *   "variables": ["nodes", "property", "value"],
 *   "examples": [
 *     "Q('input').prop('checked', true);",
 *     "const isChecked = Q('input').prop('checked');"
 *   ],
 *   "flaws": "Gets from first element only, no type checking for property values",
 *   "optimizations": "Add property validation, add batch getting capability",
 *   "performance": "O(1) for getting, O(n) for setting where n is number of elements"
 * }
 */
Q.Method('prop', function (property, value) {
    var nodes = this.nodes;
    if (value === undefined) {
        return nodes[0] ? nodes[0][property] : null;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i][property] = value;
    }
    return this;
});
