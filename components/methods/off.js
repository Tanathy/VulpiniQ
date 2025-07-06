/**
 * @metadata
 * {
 *   "name": "off",
 *   "method": "off(events, handler, options)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "Events",
 *   "desc": "Removes event handlers from selected elements.",
 *   "longDesc": "This method removes event listeners from all elements in the current selection. It supports removing multiple events by providing a space-separated string of event names. The method accepts the same handler function and options that were used when the event was originally attached. It uses the native removeEventListener method for proper cleanup of event handlers.",
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
 *     "Q('.button').off('click', handleClick);",
 *     "Q('#myDiv').off('mouseenter mouseleave', handleHover);",
 *     "Q('.input').off('input', handleInput, { passive: true });"
 *   ],
 *   "flaws": "Requires exact same handler reference and options used when adding the event",
 *   "optimizations": "Uses native removeEventListener with configurable options, supports multiple events efficiently",
 *   "performance": "Efficient event removal with native DOM methods, minimal overhead"
 * }
 */
Q.Method('off', function (events, handler, options) {
    var defaultOptions = { capture: false, once: false, passive: false },
        opts = Object.assign({}, defaultOptions, options),
        eventList = events.split(' '),
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        for (var j = 0, elen = eventList.length; j < elen; j++) {
            nodes[i].removeEventListener(eventList[j], handler, opts);
        }
    }
    return this;
});
