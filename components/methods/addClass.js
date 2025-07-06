/**
 * @metadata
 * {
 *   "name": "addClass",
 *   "method": "addClass(classes)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Adds one or more CSS classes to selected elements.",
 *   "longDesc": "This method adds the specified CSS class or classes to all elements in the current selection. It accepts a space-separated string of class names and applies them to each element using the native classList.add() method. The method supports method chaining by returning the Q instance.",
 *   "dependencies": [],
 *   "variables": [
 *     "list",
 *     "nodes"
 *   ],
 *   "examples": [
 *     "Q('.element').addClass('active');",
 *     "Q('#myDiv').addClass('highlight selected');",
 *     "Q('button').addClass('btn btn-primary');"
 *   ],
 *   "flaws": "",
 *   "optimizations": "Uses native classList.add() with apply() for efficient multiple class addition",
 *   "performance": "Efficient implementation using native DOM methods, minimal overhead with direct classList manipulation"
 * }
 */
Q.Method('addClass', function (classes) {
    var list = classes.split(' '),
        nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].classList.add.apply(nodes[i].classList, list);
    }
    return this;
});
