/**
 * @metadata
 * {
 *   "name": "each",
 *   "method": "each(callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Iteration",
 *   "desc": "Iterates over selected elements, executing a callback for each.",
 *   "longDesc": "This method iterates over all elements in the current selection, executing the provided callback function for each element. The callback receives two parameters: the index of the current element and the element itself. The callback is executed with the current element as the 'this' context, allowing direct manipulation of each element. The method supports method chaining by returning the Q instance.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('.items').each(function(index, element) { console.log(index, this); });",
 *     "Q('div').each((i, el) => el.textContent = 'Item ' + i);",
 *     "Q('.boxes').each(function() { this.style.color = 'red'; });"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Efficient iteration with direct element access, proper context binding",
 *   "performance": "Lightweight iteration with minimal overhead, direct callback execution"
 * }
 */
Q.Method('each', function (callback) {
    if (!this.nodes) return this;
    const nodes = this.nodes;
    for (let i = 0, len = nodes.length; i < len; i++) {
        callback.call(nodes[i], i, nodes[i]);
    }
    return this;
});
