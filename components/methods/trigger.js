/**
 * @metadata
 * {
 *   "name": "trigger",
 *   "method": "trigger(eventType)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "events",
 *   "desc": "Triggers a specified event on all elements in the set by dispatching a new Event object.",
 *   "longDesc": "This method triggers a specified event on all selected elements by creating and dispatching a new Event object. It allows programmatic triggering of events like click, change, input, etc. The event is dispatched on each element in the collection, which will cause any attached event listeners to be executed.",
 *   "dependencies": [],
 *   "variables": ["event"],
 *   "examples": [
 *     "Q('.button').trigger('click')",
 *     "Q('input').trigger('change')"
 *   ],
 *   "flaws": "Only supports basic Event constructor, No support for custom event data",
 *   "optimizations": "Add CustomEvent support, Allow event data passing",
 *   "performance": "O(n) where n is the number of elements"
 * }
 */
Q.Method('trigger', function (event) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].dispatchEvent(new Event(event));
    }
    return this;
});
