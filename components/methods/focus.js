/**
 * @metadata
 * {
 *   "name": "focus",
 *   "method": "focus()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Events",
 *   "desc": "Sets focus to selected elements.",
 *   "longDesc": "This method programmatically sets focus to all selected elements by calling the native focus() method. This is particularly useful for form elements like input fields, textareas, and buttons. When an element receives focus, it will trigger any associated focus event handlers and display visual focus indicators like outline or highlighting. Note that only focusable elements can receive focus.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('input').focus();",
 *     "Q('#username').focus();",
 *     "Q('textarea').focus();"
 *   ],
 *   "flaws": "Only focusable elements can receive focus",
 *   "optimizations": "Uses native focus() method for authentic focus behavior",
 *   "performance": "Efficient focus setting with native DOM method, minimal overhead"
 * }
 */
Q.Method('focus', function () {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].focus();
    }
    return this;
});
