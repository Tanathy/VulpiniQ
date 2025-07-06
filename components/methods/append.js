/**
 * @metadata
 * {
 *   "name": "append",
 *   "method": "append(...contents)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Appends content to the end of selected elements.",
 *   "longDesc": "This method appends one or more content items to the end of all selected elements. It supports various content types including strings, HTML elements, Q objects, SVG elements, arrays, and NodeLists. The method intelligently handles SVG elements by creating them in the correct namespace when needed. Multiple content items can be passed as arguments and will be appended in order.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "parent",
 *     "child",
 *     "temp",
 *     "subNodes",
 *     "i",
 *     "len",
 *     "j",
 *     "clen",
 *     "k",
 *     "slen"
 *   ],
 *   "examples": [
 *     "Q('.container').append('<p>New paragraph</p>');",
 *     "Q('#list').append(newElement, anotherElement);",
 *     "Q('svg').append('<circle cx=\"50\" cy=\"50\" r=\"20\"/>');"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses insertAdjacentHTML for strings, handles SVG namespace correctly, supports multiple content types",
 *   "performance": "Efficient content appending with appropriate methods for each content type, SVG namespace awareness"
 * }
 */
Q.Method('append', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const parent = nodes[i];
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const child = contents[j];
      if (typeof child === "string") {
        if (parent instanceof SVGElement) {
          // Inserting SVG string: create in SVG namespace
          const temp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          temp.innerHTML = child;
          Array.from(temp.childNodes).forEach(n => parent.appendChild(n));
        } else {
          parent.insertAdjacentHTML('beforeend', child);
        }
      } else if (child instanceof HTMLElement || child instanceof Q || child instanceof SVGElement) {
        parent.appendChild(child.nodes ? child.nodes[0] : child);
      } else if (Array.isArray(child) || child instanceof NodeList) {
        const subNodes = Array.from(child);
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          parent.appendChild(subNodes[k]);
        }
      }
    }
  }
  return this;
});
