/**
 * @metadata
 * {
 *   "name": "attr",
 *   "method": "attr(attribute, value) or attr(attributes)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Gets or sets HTML attributes on selected elements.",
 *   "longDesc": "This method provides comprehensive attribute manipulation for elements. When called with just an attribute name, it returns the attribute value of the first element. When called with attribute and value, it sets the attribute on all selected elements. It also supports setting multiple attributes by passing an object with key-value pairs. Uses native getAttribute and setAttribute methods for optimal performance.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "keys",
 *     "node",
 *     "klen"
 *   ],
 *   "examples": [
 *     "Q('.element').attr('data-id', '123');",
 *     "var id = Q('#myDiv').attr('id');",
 *     "Q('img').attr({ src: 'image.jpg', alt: 'Description' });"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses native setAttribute/getAttribute methods, supports batch attribute setting with objects",
 *   "performance": "Efficient attribute manipulation with native DOM methods, minimal overhead"
 * }
 */
Q.Method('attr', function (attribute, value) {
    var nodes = this.nodes;
    if (typeof attribute === 'object') {
        var keys = Object.keys(attribute);
        for (var i = 0, len = nodes.length; i < len; i++) {
            var node = nodes[i];
            for (var j = 0, klen = keys.length; j < klen; j++) {
                node.setAttribute(keys[j], attribute[keys[j]]);
            }
        }
        return this;
    } else {
        if (value === undefined) {
            return nodes[0] && nodes[0].getAttribute(attribute) || null;
        }
        for (var i = 0, len = nodes.length; i < len; i++) {
            nodes[i].setAttribute(attribute, value);
        }
        return this;
    }
});
