/**
 * @metadata
 * {
 *   "name": "find",
 *   "method": "find(selector)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Finds descendant elements within the first selected element.",
 *   "longDesc": "This method searches for descendant elements within the first element of the current selection using a CSS selector. It returns a new Q instance containing the found elements, or null if no elements are found. The search is limited to descendants of the first element in the current selection, making it useful for scoped element queries.",
 *   "dependencies": [],
 *   "variables": [
 *     "parent",
 *     "found"
 *   ],
 *   "examples": [
 *     "Q('.container').find('.item');",
 *     "Q('#sidebar').find('a[href]');",
 *     "Q('form').find('input[type=\"text\"]');"
 *   ],
 *   "flaws": "Only searches within the first element of the selection",
 *   "optimizations": "Uses native querySelectorAll for efficient CSS selector matching",
 *   "performance": "Efficient descendant search with native DOM query methods"
 * }
 */
Q.Method('find', function(selector) {
    var parent = this.nodes[0];
    if (!parent) return null;
    var found = parent.querySelectorAll(selector);
    return found.length ? Q(found) : null;
});
