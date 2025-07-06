/**
 * @metadata
 * {
 *   "name": "blur",
 *   "method": "blur()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Events",
 *   "desc": "Removes focus from selected elements.",
 *   "longDesc": "This method programmatically removes focus from all selected elements by calling the native blur() method. This is particularly useful for form elements like input fields, textareas, and buttons. When an element loses focus, it will trigger any associated blur event handlers and remove visual focus indicators like outline or highlighting.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "i",
 *     "l"
 *   ],
 *   "examples": [
 *     "Q('input').blur();",
 *     "Q('#activeField').blur();",
 *     "Q('textarea').blur();"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses native blur() method for authentic focus removal",
 *   "performance": "Efficient focus removal with native DOM method, minimal overhead"
 * }
 */
Q.Method('blur', function () {
    var nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].blur();
    }
    return this;
});
