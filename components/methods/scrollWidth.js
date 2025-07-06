/**
 * @metadata
 * {
 *   "name": "scrollWidth",
 *   "method": "scrollWidth()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "dimensions",
 *   "desc": "Returns the total scrollable width of the first element, including content not visible due to scrolling.",
 *   "longDesc": "This method returns the scrollWidth property of the first element in the selection. The scrollWidth represents the total width of the element's content, including content that is not visible due to scrolling. This is useful for determining if an element has horizontal scrollable content.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "const totalWidth = Q('.container').scrollWidth()",
 *     "if (Q('#content').scrollWidth() > 1000) { ... }"
 *   ],
 *   "flaws": "Only works with first element, No error handling for non-element nodes",
 *   "optimizations": "Add support for all elements, Add error handling",
 *   "performance": "O(1)"
 * }
 */
Q.Method('scrollWidth', function () {
    var node = this.nodes[0];
    return node.scrollWidth;
});
