/**
 * @metadata
 * {
 *   "name": "empty",
 *   "method": "empty()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "manipulation",
 *   "desc": "Removes all child elements and content from the selected elements by setting innerHTML to empty string.",
 *   "longDesc": "This method removes all child elements and text content from the selected elements by setting their innerHTML property to an empty string. This effectively clears the content while keeping the elements themselves in the DOM. Note that this approach may not properly clean up event handlers attached to child elements.",
 *   "dependencies": [],
 *   "variables": ["nodes"],
 *   "examples": [
 *     "Q('.container').empty();",
 *     "Q('div').empty();"
 *   ],
 *   "flaws": "Does not properly clean up event handlers, uses innerHTML which can be slow",
 *   "optimizations": "Use removeChild in loop, add event handler cleanup",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('empty', function () {
  var nodes = this.nodes;
  for (var i = 0, len = nodes.length; i < len; i++) {
    nodes[i].innerHTML = '';
  }
  return this;
});
