/**
 * @metadata
 * {
 *   "name": "size",
 *   "method": "size()",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "dimensions",
 *   "desc": "Returns an object containing the width and height of the first element including padding and border.",
 *   "longDesc": "This method returns an object containing the width and height properties of the first element in the selection. The dimensions include padding and border (offsetWidth and offsetHeight). This is useful for getting both dimensions at once when you need complete size information.",
 *   "dependencies": [],
 *   "variables": ["node"],
 *   "examples": [
 *     "const {width, height} = Q('.box').size()",
 *     "const dimensions = Q('#element').size()"
 *   ],
 *   "flaws": "Only works with first element, Returns object instead of allowing individual dimension access",
 *   "optimizations": "Add support for all elements, Add separate width/height methods",
 *   "performance": "O(1)"
 * }
 */
Q.Method('size', function () {
    const node = this.nodes[0];
	return {
		width: node.offsetWidth,
		height: node.offsetHeight
	};
});
