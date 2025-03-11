// Name: off
// Method: Prototype
// Desc: Removes an event listener from each node.
// Type: Event Handling
// Example: Q(selector).off("click", handler);
// Variables: events, handler, options, defaultOptions, event, el
Q.Ext('off', function (events, handler, options) {
    const defaultOptions = {
        capture: false,
        once: false,
        passive: false
    };
    options = { ...defaultOptions, ...options };
    const eventList = events.split(' ');
    for (const node of this.nodes) {
        for (const event of eventList) {
            node.removeEventListener(event, handler, options);
        }
    }
    return this;
});