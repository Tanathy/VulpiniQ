/**
 * @metadata
 * {
 *   "name": "html",
 *   "method": "html(content)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "DOM",
 *   "desc": "Gets or sets the HTML content of selected elements.",
 *   "longDesc": "This method provides comprehensive HTML content manipulation. When called without arguments, it returns the innerHTML of the first element. When called with content, it replaces the innerHTML of all selected elements. It supports various content types including strings, Q objects, HTML elements, nodes, arrays, and NodeLists. The method intelligently handles different content types and properly appends them to the target elements.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "node",
 *     "appendContent",
 *     "subs",
 *     "contArr",
 *     "m",
 *     "mlen"
 *   ],
 *   "examples": [
 *     "Q('.element').html('<p>New content</p>');",
 *     "var content = Q('#myDiv').html();",
 *     "Q('.container').html([elem1, elem2, elem3]);"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses insertAdjacentHTML for string content, supports multiple content types efficiently",
 *   "performance": "Optimized for various content types with appropriate DOM manipulation methods for each case"
 * }
 */
Q.Method('html', function (content) {
    var nodes = this.nodes;
    if (content === undefined) {
        return nodes[0] ? nodes[0].innerHTML : null;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        node.innerHTML = '';
        var appendContent = function(child) {
            if (typeof child === 'string') {
                node.insertAdjacentHTML('beforeend', child);
            } else if (child instanceof Q) {
                for (var j = 0, clen = child.nodes.length; j < clen; j++) {
                    node.appendChild(child.nodes[j]);
                }
            } else if (child instanceof HTMLElement || child instanceof Node) {
                node.appendChild(child);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                var subs = Array.from(child);
                for (var k = 0, slen = subs.length; k < slen; k++) {
                    node.appendChild(subs[k]);
                }
            }
        };
        if (Array.isArray(content) || content instanceof NodeList) {
            var contArr = Array.from(content);
            for (var m = 0, mlen = contArr.length; m < mlen; m++) {
                appendContent(contArr[m]);
            }
        } else {
            appendContent(content);
        }
    }
    return this;
});
