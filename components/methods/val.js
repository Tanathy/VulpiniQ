/**
 * @metadata
 * {
 *   "name": "val",
 *   "method": "val(input)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Forms",
 *   "desc": "Gets or sets the value of form elements.",
 *   "longDesc": "This method provides a convenient way to get or set the value of form elements like input fields, textareas, and select elements. When called without arguments, it returns the value of the first element in the selection. When called with a value, it sets the value property of all selected elements. This is particularly useful for form manipulation and data binding operations.",
 *   "dependencies": [],
 *   "variables": [
 *     "i",
 *     "n"
 *   ],
 *   "examples": [
 *     "Q('#username').val('john_doe');",
 *     "var username = Q('#username').val();",
 *     "Q('input[type=\"text\"]').val('');"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses native value property for direct form element manipulation",
 *   "performance": "Efficient form value manipulation with native DOM properties"
 * }
 */
Q.Method('val', function(input) {
    if (input === undefined) return this.nodes[0]?.value || null;
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].value = input;
    }
    return this;
});
