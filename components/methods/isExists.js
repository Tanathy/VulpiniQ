/**
 * @metadata
 * {
 *   "name": "isExists",
 *   "method": "isExists()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "traversal",
 *   "desc": "Checks if the first element exists in the DOM. Also provides Q.isExists(selector) to check if any element matching selector exists.",
 *   "longDesc": "This method determines whether the first element in the selection currently exists in the DOM tree. It uses document.body.contains() to check if the element is attached to the document. The method also provides a static version Q.isExists(selector) that can check for the existence of elements by selector without creating a Q instance first.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "Q('.item').isExists();",
 *     "Q.isExists('.modal');"
 *   ],
 *   "flaws": "Only checks first element for instance method, uses document.body.contains which may not work for detached elements",
 *   "optimizations": "Use document.contains instead, add support for checking all elements",
 *   "performance": "O(h) where h is the height of the DOM tree"
 * }
 */
Q.Method('isExists', function () {
    var node = this.nodes[0];
    return node ? document.body.contains(node) : false;
});
Q.isExists = function (selector) {
    return document.querySelector(selector) !== null;
};
