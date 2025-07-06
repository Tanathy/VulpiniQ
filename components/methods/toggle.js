/**
 * @metadata
 * {
 *   "name": "toggle",
 *   "method": "toggle()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Effects",
 *   "desc": "Toggles element visibility without animation.",
 *   "longDesc": "This method toggles the visibility of selected elements by switching their display style property between 'none' and an empty string. If an element is currently hidden (display: none), it will be shown, and vice versa. This is an instant toggle without any animation effects. The method directly manipulates the display CSS property for immediate visibility changes.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('.element').toggle();",
 *     "Q('#menu').toggle();",
 *     "Q('.panel').toggle();"
 *   ],
 *   "flaws": "Only checks inline style display property, not computed styles",
 *   "optimizations": "Simple and fast display property manipulation",
 *   "performance": "Instant visibility toggle with minimal overhead, direct style property manipulation"
 * }
 */
Q.Method('toggle', function () {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].style.display = (nodes[i].style.display === 'none' ? '' : 'none');
    }
    return this;
});
