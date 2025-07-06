/**
 * @metadata
 * {
 *   "name": "detach",
 *   "method": "detach()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "manipulation",
 *   "desc": "Removes elements from the DOM while preserving them in memory. The detached elements remain in the Q object for potential re-insertion.",
 *   "longDesc": "This method removes all selected elements from their parent nodes while keeping them in memory within the Q object. Unlike remove(), detach() preserves the elements so they can be reinserted into the DOM later. This is useful for temporarily removing elements without losing their structure, content, or event handlers.",
 *   "dependencies": [],
 *   "variables": ["nodes", "detachedNodes", "node", "parent"],
 *   "examples": [
 *     "const detached = Q('.temporary').detach();",
 *     "Q('.item').detach().appendTo('.container');"
 *   ],
 *   "flaws": "Modifies original nodes array, may cause memory leaks if references are kept",
 *   "optimizations": "Return new Q object with detached nodes, add reattachment tracking",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('detach', function() {
    const nodes = this.nodes;
    const detachedNodes = [];
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const parent = node.parentNode;
        if (parent) {
            detachedNodes.push(node);
            parent.removeChild(node);
        }
    }
    this.nodes = detachedNodes;
    return this;
});
