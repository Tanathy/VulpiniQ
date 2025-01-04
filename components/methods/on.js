// Name: on
// Method: Prototype
// Desc: Adds an event listener to each node.
// Type: Event Handling
// Example: Q(selector).on("click", () => console.log("Clicked"));
// Variables: events, handler, options, defaultOptions, el, event
Q.Ext('on', function (events, handler, options) {
    const defaultOptions = {
        capture: false,
        once: false,
        passive: false
    };

    options = { ...defaultOptions, ...options };

    return this.each(el => {
        events.split(' ').forEach(event => {
            this.nodes[el].addEventListener(event, handler, options);
        });
    });
});