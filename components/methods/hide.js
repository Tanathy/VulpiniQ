/**
 * @metadata
 * {
 *   "name": "hide",
 *   "method": "hide(duration, callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Effects",
 *   "desc": "Hides visible elements with optional fade-out animation.",
 *   "longDesc": "This method hides visible elements by setting their display style to 'none'. When a duration is specified, it performs a fade-out animation by transitioning the opacity from 1 to 0 over the specified time period, then sets display to none. An optional callback function can be provided that will be executed when the animation completes. For instant hiding without animation, use a duration of 0.",
 *   "dependencies": [],
 *   "variables": [
 *     "nodes",
 *     "node",
 *     "i",
 *     "len"
 *   ],
 *   "examples": [
 *     "Q('.visible').hide();",
 *     "Q('#modal').hide(500);",
 *     "Q('.element').hide(300, function() { console.log('Hidden!'); });"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses CSS transitions for smooth animations, proper event cleanup, closure pattern for node reference",
 *   "performance": "Efficient visibility control with optional smooth animations using CSS transitions"
 * }
 */
Q.Method('hide', function (duration, callback) {
    duration = duration || 0;
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        if (duration === 0) {
            node.style.display = 'none';
            if (callback) callback();
        } else {
            node.style.transition = 'opacity ' + duration + 'ms';
            node.style.opacity = 1;
            setTimeout((function(n) {
                return function() {
                    n.style.opacity = 0;
                    n.addEventListener('transitionend', function handler() {
                        n.style.display = 'none';
                        n.style.transition = '';
                        n.removeEventListener('transitionend', handler);
                        if (callback) callback();
                    });
                };
            })(node), 0);
        }
    }
    return this;
});
