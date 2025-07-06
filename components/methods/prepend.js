/**
 * @metadata
 * {
 *   "name": "prepend",
 *   "method": "prepend(...contents)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Prepends content to the beginning of selected elements.",
 *   "longDesc": "This method prepends one or more content items to the beginning of all selected elements. It supports various content types including strings, HTML elements, Q objects, arrays, and NodeLists. The method uses insertAdjacentHTML for string content and insertBefore for element nodes. Content is inserted at the beginning of each element, before any existing children.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "contents",
 *     "parent",
 *     "child",
 *     "subNodes",
 *     "i",
 *     "j",
 *     "k"
 *   ],
 *   "examples": [
 *     "Q('.container').prepend('<h1>Title</h1>');",
 *     "Q('#list').prepend(newElement);",
 *     "Q('div').prepend('<span>First</span>', secondElement);"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses insertAdjacentHTML for strings, insertBefore for elements, supports multiple content types",
 *   "performance": "Efficient content prepending with appropriate methods for each content type"
 * }
 */
Q.Method('prepend', function () {
    var nodes = this.nodes,
        contents = Array.prototype.slice.call(arguments),
        i, j, k, parent, child, subNodes;
    for (i = 0; i < nodes.length; i++) {
        parent = nodes[i];
        for (j = 0; j < contents.length; j++) {
            child = contents[j];
            if (typeof child === 'string') {
                parent.insertAdjacentHTML('afterbegin', child);
            } else if (child instanceof Q) {
                parent.insertBefore(child.nodes[0], parent.firstChild);
            } else if (child instanceof HTMLElement || child instanceof Node) {
                parent.insertBefore(child, parent.firstChild);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                subNodes = Array.from(child);
                for (k = 0; k < subNodes.length; k++) {
                    parent.insertBefore(subNodes[k], parent.firstChild);
                }
            }
        }
    }
    return this;
});
