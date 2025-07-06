/**
 * @metadata
 * {
 *   "name": "removeTransition",
 *   "method": "removeTransition()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "animation",
 *   "desc": "Removes all CSS transition properties from the selected elements.",
 *   "longDesc": "This method removes all CSS transition properties from the selected elements by setting the transition style property to an empty string. This effectively disables any ongoing or future CSS transitions on the elements, allowing for immediate style changes without animation effects.",
 *   "dependencies": [],
 *   "variables": [],
 *   "examples": [
 *     "Q('.animated').removeTransition();",
 *     "Q('.element').removeTransition();"
 *   ],
 *   "flaws": "Removes all transition properties at once, no selective removal",
 *   "optimizations": "Add selective transition property removal",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('removeTransition', function () {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.transition = '';
    }
    return this;
});
