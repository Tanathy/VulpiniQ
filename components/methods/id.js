/**
 * @metadata
 * {
 *   "name": "id",
 *   "method": "id(ident)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "attributes",
 *   "desc": "Gets or sets the ID attribute of the first element in the set. Returns the ID value when getting, or the Q object when setting.",
 *   "longDesc": "This method provides access to the ID attribute of the first element in the selection. When called without arguments, it returns the current ID value. When called with an identifier string, it sets the ID attribute of the first element. Note that HTML IDs should be unique within a document, so this method only operates on the first element to maintain this constraint.",
 *   "dependencies": [],
 *   "variables": ["node", "ident"],
 *   "examples": [
 *     "const id = Q('.item').id();",
 *     "Q('.item').id('new-id');"
 *   ],
 *   "flaws": "Only works with first element, no validation for valid ID format",
 *   "optimizations": "Add ID format validation, add support for setting multiple elements",
 *   "performance": "O(1)"
 * }
 */
Q.Method('id', function (ident) {
    var node = this.nodes[0];
    if (ident === undefined) return node.id;
    node.id = ident;
    return this;
});
