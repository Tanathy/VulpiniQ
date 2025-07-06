/**
 * @metadata
 * {
 *   "name": "replaceWith",
 *   "method": "replaceWith(content)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "manipulation",
 *   "desc": "Replaces each element in the set with the provided content.",
 *   "longDesc": "This method replaces each element in the current selection with the specified content. The content can be HTML strings, DOM elements, or Q objects. Each selected element is removed from the DOM and replaced with the new content at the same position in the document structure.",
 *   "dependencies": [],
 *   "variables": ["content", "nodes", "element", "parent"],
 *   "examples": [
 *     "Q('.old-element').replaceWith('<div class=\"new-element\">New content</div>');",
 *     "Q('#target').replaceWith(newElement);"
 *   ],
 *   "flaws": "May lose event handlers attached to replaced elements",
 *   "optimizations": "Add event handler preservation option",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('replaceWith', function(newContent) {
    // Replace each node in this Q instance with newContent (Q instance or DOM node)
    const nodes = this.nodes;
    let newNodes = (newContent instanceof Q) ? newContent.nodes : [newContent];
    for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        if (node && node.parentNode) {
            for (let j = 0; j < newNodes.length; j++) {
                node.parentNode.insertBefore(newNodes[j].cloneNode(true), node);
            }
            node.parentNode.removeChild(node);
        }
    }
    return this;
});
