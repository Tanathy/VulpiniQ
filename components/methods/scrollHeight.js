/**
 * @metadata
 * {
 *   "name": "scrollHeight",
 *   "method": "scrollHeight()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "dimensions",
 *   "desc": "Returns the total scrollable height of the first element, including content not visible due to scrolling.",
 *   "longDesc": "This method returns the total scrollable height of the first element in the selection, including any content that is not currently visible due to scrolling. It uses the native scrollHeight property which represents the entire height of the element's content, including overflow content not visible in the viewport.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "const totalHeight = Q('.container').scrollHeight();",
 *     "if (Q('#content').scrollHeight() > 500) { console.log('Long content'); }"
 *   ],
 *   "flaws": "Only works with first element, no error handling for non-element nodes",
 *   "optimizations": "Add support for all elements, add error handling",
 *   "performance": "O(1)"
 * }
 */
Q.Method('scrollHeight', function () {
    var node = this.nodes[0];
    return node.scrollHeight;
});
