/**
 * @metadata
 * {
 *   "name": "toggleClass",
 *   "method": "toggleClass(className)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "attributes",
 *   "desc": "Toggles the specified CSS class on all elements in the set. Adds the class if not present, removes it if present.",
 *   "longDesc": "This method toggles the specified CSS class on all elements in the current selection. If the class is present on an element, it will be removed; if the class is not present, it will be added. This uses the native classList.toggle() method for efficient class manipulation and provides a convenient way to switch element states.",
 *   "dependencies": [],
 *   "variables": ["className"],
 *   "examples": [
 *     "Q('.item').toggleClass('active');",
 *     "Q('.menu').toggleClass('open');"
 *   ],
 *   "flaws": "Only supports single class, no force parameter support",
 *   "optimizations": "Add support for multiple classes, add force parameter",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('toggleClass', function (className) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].classList.toggle(className);
    }
    return this;
});
