/**
 * @metadata
 * {
 *   "name": "removeClass",
 *   "method": "removeClass(classes)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Removes one or more CSS classes from selected elements.",
 *   "longDesc": "This method removes the specified CSS class or classes from all elements in the current selection. It accepts a space-separated string of class names and removes them from each element using the native classList.remove() method. The method supports method chaining by returning the Q instance.",
 *   "dependencies": [],
 *   "variables": [
 *     "list"
 *   ],
 *   "examples": [
 *     "Q('.element').removeClass('active');",
 *     "Q('#myDiv').removeClass('highlight selected');",
 *     "Q('button').removeClass('btn btn-primary');"
 *   ],
 *   "flaws": "",
 *   "optimizations": "Uses native classList.remove() with apply() for efficient multiple class removal",
 *   "performance": "Efficient implementation using native DOM methods, minimal overhead with direct classList manipulation"
 * }
 */
Q.Method('removeClass', function (classes) {
    var list = classes.split(' ');
    for (var i = 0, len = this.nodes.length; i < len; i++) {
        this.nodes[i].classList.remove.apply(this.nodes[i].classList, list);
    }
    return this;
});
