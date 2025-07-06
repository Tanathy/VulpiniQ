/**
 * @metadata
 * {
 *   "name": "fadeToggle",
 *   "method": "fadeToggle(duration, callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Effects",
 *   "desc": "Toggles element visibility with fade animation.",
 *   "longDesc": "This method toggles the visibility of selected elements using fade animations. It checks the current opacity of each element and applies either a fadeIn or fadeOut effect accordingly. If the element's opacity is 0, it will fade in; otherwise, it will fade out. The method relies on the existing fadeIn and fadeOut implementations for the actual animation logic.",
 *   "dependencies": [
 *     "fadeIn",
 *     "fadeOut"
 *   ],
 *   "variables": [
 *     "nodes",
 *     "computed",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('.element').fadeToggle();",
 *     "Q('#modal').fadeToggle(600);",
 *     "Q('.panel').fadeToggle(400, function() { console.log('Toggled!'); });"
 *   ],
 *   "flaws": "Relies on computed style opacity check which may not always reflect intended state",
 *   "optimizations": "Uses existing fadeIn/fadeOut methods, checks computed styles for current state",
 *   "performance": "Efficient toggle logic using existing fade methods, minimal overhead with computed style check"
 * }
 */
Q.Method('fadeToggle', function(duration, callback) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var computed = window.getComputedStyle(nodes[i]);
        if (computed.opacity === '0') {
            this.fadeIn(duration, callback);
        } else {
            this.fadeOut(duration, callback);
        }
    }
    return this;
});
