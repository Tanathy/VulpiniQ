/**
 * @metadata
 * {
 *   "name": "text",
 *   "method": "text(content)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Gets or sets the text content of selected elements.",
 *   "longDesc": "This method provides simple text content manipulation for elements. When called without arguments, it returns the textContent of the first element. When called with content, it sets the textContent of all selected elements, automatically escaping any HTML content for security. This is safer than using innerHTML when working with user-generated content.",
 *   "dependencies": [],
 *   "variables": [
 *     "i",
 *     "n"
 *   ],
 *   "examples": [
 *     "Q('.element').text('New text content');",
 *     "var text = Q('#myDiv').text();",
 *     "Q('.message').text('User: ' + userName);"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses native textContent property for optimal performance",
 *   "performance": "Efficient text manipulation with native DOM property, automatic HTML escaping for security"
 * }
 */
Q.Method('text', function (content) {
    if (content === undefined) {
        return this.nodes[0]?.textContent || null;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].textContent = content;
    }
    return this;
});
