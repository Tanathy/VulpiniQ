/**
 * @metadata
 * {
 *   "name": "fadeOut",
 *   "method": "fadeOut(duration, callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Effects",
 *   "desc": "Fades out visible elements with smooth opacity transition.",
 *   "longDesc": "This method performs a fade-out animation on selected elements by transitioning their opacity from the current value to 0 over a specified duration. After the animation completes, the element's display is set to 'none' to completely hide it. A callback function can be provided to execute when the animation completes. The method uses CSS transitions for smooth animation performance.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "el",
 *     "elemStyle",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('.visible').fadeOut(400);",
 *     "Q('#modal').fadeOut(600);",
 *     "Q('.element').fadeOut(500, function() { console.log('Faded out!'); });"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses CSS transitions for smooth animation, sets display none after completion",
 *   "performance": "Efficient fade animation using CSS transitions, cleanup of transition styles after completion"
 * }
 */
Q.Method('fadeOut', function(duration, callback) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var elemStyle = el.style;
            elemStyle.transition = 'opacity ' + duration + 'ms';
            elemStyle.opacity = 0;
            setTimeout(function() {
                elemStyle.transition = '';
                elemStyle.display = 'none';
                if (callback) callback();
            }, duration);
        })(nodes[i]);
    }
    return this;
});
