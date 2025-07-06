/**
 * @metadata
 * {
 *   "name": "bind",
 *   "method": "bind(event, handler)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "events",
 *   "desc": "Binds event handlers using event delegation. Events are delegated from document level and trigger when target is within selected elements.",
 *   "longDesc": "This method provides event delegation functionality by creating a global event delegation system. Events are bound at the document level and filtered to trigger only when the event target is contained within the selected elements. This approach is efficient for dynamic content and reduces memory usage compared to individual event listeners.",
 *   "dependencies": [],
 *   "variables": ["_eventDelegation", "nodes"],
 *   "examples": [
 *     "Q('.container').bind('click', function(e) { console.log('clicked'); });",
 *     "Q('.form').bind('submit', handleSubmit);"
 *   ],
 *   "flaws": "Creates global event delegation system, may cause memory leaks if not properly cleaned",
 *   "optimizations": "Add unbind functionality, use WeakMap for event tracking",
 *   "performance": "O(1) for binding, O(n) for event triggering where n is number of bound elements"
 * }
 */
Q.Method('bind', function (event, handler) {
    if (!this._eventDelegation) {
        this._eventDelegation = {};
    }
    if (!this._eventDelegation[event]) {
        document.addEventListener(event, (e) => {
            var nodes = this.nodes;
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (nodes[i].contains(e.target)) {
                    handler.call(e.target, e);
                }
            }
        });
        this._eventDelegation[event] = true;
    }
    return this;
});
