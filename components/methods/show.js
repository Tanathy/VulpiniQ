/**
 * @metadata
 * {
 *   "name": "show",
 *   "method": "show(duration, callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Effects",
 *   "desc": "Shows hidden elements with optional fade-in animation.",
 *   "longDesc": "This method shows hidden elements by removing the display style property. When a duration is specified, it performs a fade-in animation by transitioning the opacity from 0 to 1 over the specified time period. An optional callback function can be provided that will be executed when the animation completes. For instant showing without animation, use a duration of 0.",
 *   "dependencies": [],
 *   "variables": [
 *     "element",
 *     "i",
 *     "n"
 *   ],
 *   "examples": [
 *     "Q('.hidden').show();",
 *     "Q('#modal').show(500);",
 *     "Q('.element').show(300, function() { console.log('Shown!'); });"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses CSS transitions for smooth animations, cleanup of transition styles after completion",
 *   "performance": "Efficient visibility control with optional smooth animations using CSS transitions"
 * }
 */
Q.Method('show', function (duration = 0, callback) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const element = this.nodes[i];
        if (duration === 0) {
            element.style.display = '';
            if (callback) callback();
        } else {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 0;
            element.style.display = '';
            setTimeout(() => {
                element.style.opacity = 1;
                element.addEventListener('transitionend', () => {
                    element.style.transition = '';
                    if (callback) callback();
                }, { once: true });
            }, 0);
        }
    }
    return this;
});
