/**
 * @metadata
 * {
 *   "name": "css",
 *   "method": "css(property, value) or css(properties)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Gets or sets CSS properties on selected elements.",
 *   "longDesc": "This method provides a flexible way to manipulate CSS styles on elements. It can get computed styles when called with just a property name, set a single style property when called with property and value, or set multiple properties when called with an object. When getting a value, it returns the computed style of the first element. When setting values, it applies them to all elements in the selection.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "elemStyle",
 *     "key"
 *   ],
 *   "examples": [
 *     "Q('.element').css('color', 'red');",
 *     "Q('#myDiv').css({ color: 'blue', fontSize: '16px' });",
 *     "var color = Q('.element').css('color');"
 *   ],
 *   "flaws": "",
 *   "optimizations": "Caches nodes reference, uses direct style property assignment for performance",
 *   "performance": "Efficient style manipulation with minimal DOM queries, uses getComputedStyle for accurate value retrieval"
 * }
 */
Q.Method('css', function(property, value) {
  const nodes = this.nodes;
  if (typeof property === 'object') {
      for (let i = 0, len = nodes.length; i < len; i++) {
          const elemStyle = nodes[i].style;
          for (const key in property) {
              elemStyle[key] = property[key];
          }
      }
      return this;
  }
  if (value === Q._.un) return getComputedStyle(nodes[0])[property];
  for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].style[property] = value;
  }
  return this;
});
