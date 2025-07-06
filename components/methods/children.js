/**
 * @metadata
 * {
 *   "name": "children",
 *   "method": "children(selector)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Traversal",
 *   "desc": "Gets child elements of selected elements, optionally filtered by selector.",
 *   "longDesc": "This method returns a new Q instance containing all direct child elements of the selected elements. An optional CSS selector can be provided to filter the children to only those that match the selector. The method collects children from all elements in the current selection and returns them as a flat array. Only direct children are included, not deeper descendants.",
 *   "dependencies": [],
 *   "variables": [
 *     "result",
 *     "nodes",
 *     "parent",
 *     "childElements",
 *     "i",
 *     "len",
 *     "j"
 *   ],
 *   "examples": [
 *     "Q('.container').children();",
 *     "Q('#parent').children('.item');",
 *     "Q('ul').children('li.active');"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses native children property and matches() for efficient filtering",
 *   "performance": "Efficient child element collection with optional CSS selector filtering"
 * }
 */
Q.Method('children', function (selector) {
  const result = [];
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const parent = nodes[i];
    if (!parent || !parent.children) continue;
    const childElements = parent.children;
    if (selector) {
      for (let j = 0; j < childElements.length; j++) {
        if (childElements[j].matches && childElements[j].matches(selector)) {
          result.push(childElements[j]);
        }
      }
    } else {
      for (let j = 0; j < childElements.length; j++) {
        result.push(childElements[j]);
      }
    }
  }
  return new Q(result);
});
