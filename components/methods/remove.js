/**
 * @metadata
 * {
 *   "name": "remove",
 *   "method": "remove()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Removes selected elements from the DOM.",
 *   "longDesc": "This method removes all selected elements from the DOM tree using the native remove() method. The elements are completely removed from their parent nodes and can no longer be accessed or manipulated. This is a destructive operation that cannot be undone. The method supports method chaining by returning the Q instance, though the removed elements are no longer part of the selection.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('.unwanted').remove();",
 *     "Q('#temporaryElement').remove();",
 *     "Q('.items').filter('.selected').remove();"
 *   ],
 *   "flaws": "Destructive operation that cannot be undone",
 *   "optimizations": "Uses native remove() method for efficient DOM removal",
 *   "performance": "Efficient element removal with native DOM method, minimal overhead"
 * }
 */
Q.Method('remove', function() {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].remove();
    }
    return this;
});
