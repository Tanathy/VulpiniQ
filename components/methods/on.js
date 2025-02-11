// Name: on
// Method: Prototype
// Desc: Adds an event listener to each node.
// Type: Event Handling
// Example: Q(selector).on("click", () => console.log("Clicked"));
// Variables: events, handler, options, defaultOptions, eventName, node
Q.Ext('on', function (events, handler, options) {
    const defaultOptions = { capture: false, once: false, passive: false };
    options = { ...defaultOptions, ...options };
    return this.each(node => {
      events.split(' ').forEach(eventName => {
        node.addEventListener(eventName, handler, options);
      });
    });
  });