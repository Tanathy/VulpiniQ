/**
 * @metadata
 * {
 *   "name": "fadeIn",
 *   "method": "fadeIn(duration, callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Effects",
 *   "desc": "Fades in hidden elements with smooth opacity transition.",
 *   "longDesc": "This method performs a fade-in animation on selected elements by transitioning their opacity from 0 to 1 over a specified duration. The method first makes the element visible by removing the display style, then applies a CSS transition to smoothly animate the opacity. A callback function can be provided to execute when the animation completes. The default duration is 400ms if not specified.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "el",
 *     "elemStyle",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('.hidden').fadeIn();",
 *     "Q('#modal').fadeIn(600);",
 *     "Q('.element').fadeIn(500, function() { console.log('Faded in!'); });"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses CSS transitions for smooth animation, forces reflow with offsetHeight for proper timing",
 *   "performance": "Efficient fade animation using CSS transitions, cleanup of transition styles after completion"
 * }
 */
Q.Method('fadeIn', function(duration, callback) {
    duration = duration || 400;
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var elemStyle = el.style;
            elemStyle.display = '';
            elemStyle.transition = 'opacity ' + duration + 'ms';
            void el.offsetHeight;
            elemStyle.opacity = 1;
            setTimeout(function() {
                elemStyle.transition = '';
                if (callback) callback();
            }, duration);
        })(nodes[i]);
    }
    return this;
});
