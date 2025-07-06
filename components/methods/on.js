/**
 * @metadata
 * {
 *   "name": "on",
 *   "method": "on(events, handler, options)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Events",
 *   "desc": "Attaches event handlers to selected elements.",
 *   "longDesc": "This method attaches event listeners to all elements in the current selection. It supports multiple events by providing a space-separated string of event names. The method accepts optional configuration options for event handling behavior including capture, once, and passive flags. It uses the native addEventListener method for optimal performance and compatibility.",
 *   "dependencies": [],
 *   "variables": [
 *     "defaultOptions",
 *     "opts",
 *     "eventList",
 *     "nodes",
 *     "i",
 *     "len",
 *     "j",
 *     "elen"
 *   ],
 *   "examples": [
 *     "Q('.button').on('click', function() { console.log('clicked'); });",
 *     "Q('#myDiv').on('mouseenter mouseleave', handleHover);",
 *     "Q('.input').on('input', handleInput, { passive: true });"
 *   ],
 *   "flaws": "None known",
 *   "optimizations": "Uses native addEventListener with configurable options, supports multiple events efficiently",
 *   "performance": "Efficient event binding with native DOM methods, minimal overhead with direct addEventListener usage"
 * }
 */
Q.Method('on', function (events, handler, options) {
    var defaultOptions = { capture: false, once: false, passive: false },
        opts = Object.assign({}, defaultOptions, options),
        eventList = events.split(' '),
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        for (var j = 0, elen = eventList.length; j < elen; j++) {
            nodes[i].addEventListener(eventList[j], handler, opts);
        }
    }
    return this;
});
