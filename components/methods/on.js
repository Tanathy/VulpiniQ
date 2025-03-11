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
  const eventList = events.split(' ');

  return this.each(index => {
      const node = this.nodes[index];
      eventList.forEach(event => {
          node.addEventListener(event, handler, options);
      });
  });
});