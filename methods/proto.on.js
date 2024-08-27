Q.prototype.on = function (events, handler, options = {}) {
    // Adds an event listener to each node.|Event Handling|Q(selector).on("click", () => console.log("Clicked"));
    const defaultOptions = {
        capture: false,
        once: false,
        passive: false
    };

    options = { ...defaultOptions, ...options };


    return this.each(el => {
        events.split(' ').forEach(event => this.nodes[el].addEventListener(event, handler, options));
    }
    );
};