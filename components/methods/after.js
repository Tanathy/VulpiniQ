/**
 * @metadata
 * {
 *   "name": "after",
 *   "method": "after(...contents)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "manipulation",
 *   "desc": "Inserts content after each element in the current set. Content can be HTML strings, DOM elements, Q objects, arrays, or NodeLists.",
 *   "longDesc": "This method inserts the specified content after each element in the current selection. It supports various content types including HTML strings, DOM elements, Q objects, arrays, and NodeLists. The content is inserted as siblings after each target element.",
 *   "dependencies": [],
 *   "variables": ["nodes", "target", "parent", "content", "nextSibling", "subNodes"],
 *   "examples": [
 *     "Q('.item').after('<p>New content</p>');",
 *     "Q('#header').after(document.createElement('div'));",
 *     "Q('.element').after(Q('.another-element'));"
 *   ],
 *   "flaws": "Does not handle all edge cases with nested structures, performance can degrade with large content arrays",
 *   "optimizations": "Pre-process content type checking, use document fragments for multiple elements",
 *   "performance": "O(n*m) where n is number of elements and m is number of content items"
 * }
 */
Q.Method('after', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const target = nodes[i];
    const parent = target.parentNode;
    if (!parent) continue;
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const content = contents[j];
      if (typeof content === "string") {
        target.insertAdjacentHTML('afterend', content);
      } else if (content instanceof HTMLElement) {
        if (target.nextSibling) {
          parent.insertBefore(content, target.nextSibling);
        } else {
          parent.appendChild(content);
        }
      } else if (content instanceof Q) {
        if (target.nextSibling) {
          parent.insertBefore(content.nodes[0], target.nextSibling);
        } else {
          parent.appendChild(content.nodes[0]);
        }
      } else if (Array.isArray(content) || content instanceof NodeList) {
        const subNodes = Array.from(content);
        let nextSibling = target.nextSibling;
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          if (nextSibling) {
            parent.insertBefore(subNodes[k], nextSibling);
            // Update nextSibling to be the sibling of the newly inserted node
            nextSibling = subNodes[k].nextSibling;
          } else {
            parent.appendChild(subNodes[k]);
          }
        }
      }
    }
  }
  return this;
});
