/**
 * @metadata
 * {
 *   "name": "unwrap",
 *   "method": "unwrap()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "manipulation",
 *   "desc": "Removes the parent element of each element in the set, moving the element up one level in the DOM hierarchy.",
 *   "longDesc": "This method removes the parent element of each selected element, effectively moving the elements up one level in the DOM hierarchy. The parent element is replaced with its child nodes. This is useful for removing wrapper elements while preserving their contents. The method includes a safety check to prevent unwrapping from the document body.",
 *   "dependencies": [],
 *   "variables": ["el", "parent"],
 *   "examples": [
 *     "Q('.inner').unwrap()",
 *     "Q('span').unwrap()"
 *   ],
 *   "flaws": "Does not check if parent has other important children, Hardcoded body check",
 *   "optimizations": "Add safety checks, Make parent exclusion configurable",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('unwrap', function () {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const el = this.nodes[i];
        const parent = el.parentNode;
        if (parent && parent !== document.body) {
            parent.replaceWith(...parent.childNodes);
        }
    }
    return this;
});
