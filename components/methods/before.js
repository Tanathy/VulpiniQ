/**
 * @metadata
 * {
 *   "name": "before",
 *   "method": "before(...contents)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Inserts content before selected elements.",
 *   "longDesc": "This method inserts one or more content items before each selected element as siblings. It supports various content types including strings, HTML elements, Q objects, arrays, and NodeLists. The method uses insertAdjacentHTML for string content and insertBefore for element nodes. Content is inserted into the parent of each target element, positioned immediately before the target.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "target",
 *     "parent",
 *     "content",
 *     "subNodes",
 *     "i",
 *     "len",
 *     "j",
 *     "clen",
 *     "k",
 *     "slen"
 *   ],
 *   "examples": [
 *     "Q('.element').before('<h1>Title</h1>');",
 *     "Q('#target').before(newElement);",
 *     "Q('div').before('<span>Before</span>', anotherElement);"
 *   ],
 *   "flaws": "Skips elements without parent nodes",
 *   "optimizations": "Uses insertAdjacentHTML for strings, insertBefore for elements, supports multiple content types",
 *   "performance": "Efficient content insertion with appropriate methods for each content type"
 * }
 */
Q.Method('before', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const target = nodes[i];
    const parent = target.parentNode;
    if (!parent) continue;
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const content = contents[j];
      if (typeof content === "string") {
        target.insertAdjacentHTML('beforebegin', content);
      } else if (content instanceof HTMLElement) {
        parent.insertBefore(content, target);
      } else if (content instanceof Q) {
        parent.insertBefore(content.nodes[0], target);
      } else if (Array.isArray(content) || content instanceof NodeList) {
        const subNodes = Array.from(content);
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          parent.insertBefore(subNodes[k], target);
        }
      }
    }
  }
  return this;
});
