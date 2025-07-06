/**
 * @metadata
 * {
 *   "name": "data",
 *   "method": "data(key, value)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "attributes",
 *   "desc": "Gets or sets data attributes using the dataset API. Returns the value when getting, or the Q object when setting.",
 *   "longDesc": "This method provides access to HTML5 data attributes through the native dataset API. When called with just a key, it returns the data attribute value from the first element. When called with key and value, it sets the data attribute on all selected elements. The method automatically handles the conversion between kebab-case HTML attributes and camelCase JavaScript properties.",
 *   "dependencies": [],
 *   "variables": ["nodes", "key", "value"],
 *   "examples": [
 *     "Q('.item').data('id', '123');",
 *     "const id = Q('.item').data('id');"
 *   ],
 *   "flaws": "Uses internal Q undefined constants, only gets from first element",
 *   "optimizations": "Use standard undefined check, add batch getting capability",
 *   "performance": "O(1) for getting, O(n) for setting where n is number of elements"
 * }
 */
Q.Method('data', function (key, value) {
    const nodes = this.nodes;
    if (value === Q._.un) {
        return nodes[0] && nodes[0].dataset[key] || Q._.n;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].dataset[key] = value;
    }
    return this;
});
