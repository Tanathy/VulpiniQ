/**
 * @metadata
 * {
 *   "name": "fadeTo",
 *   "method": "fadeTo(opacity, duration, callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Effects",
 *   "desc": "Animates elements to a specific opacity level.",
 *   "longDesc": "This method animates selected elements to a specific opacity value over a specified duration. Unlike fadeIn and fadeOut, this method allows you to set any opacity value between 0 and 1. The animation uses CSS transitions for smooth performance. A callback function can be provided to execute when the animation completes. The method forces a reflow to ensure proper animation timing.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "el",
 *     "style",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('.element').fadeTo(0.5, 400);",
 *     "Q('#image').fadeTo(0.3, 600, function() { console.log('Faded!'); });",
 *     "Q('.overlay').fadeTo(0.8, 300);"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses CSS transitions for smooth animation, forces reflow with offsetHeight for proper timing",
 *   "performance": "Efficient opacity animation using CSS transitions, cleanup of transition styles after completion"
 * }
 */
Q.Method('fadeTo', function(opacity, duration, callback) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var style = el.style;
            style.transition = 'opacity ' + duration + 'ms';
            void el.offsetHeight;
            style.opacity = opacity;
            setTimeout(function() {
                style.transition = '';
                if (callback) callback();
            }, duration);
        })(nodes[i]);
    }
    return this;
});
