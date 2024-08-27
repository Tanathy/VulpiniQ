Q.prototype.off = function (events, handler, options = {}) {
    // Removes an event listener from each node.|Event Handling|Q(selector).off("click", handler);
    const defaultOptions = {
        capture: false,
        once: false,
        passive: false
    };
    options = { ...defaultOptions, ...options };

    return this.each(el => {
        events.split(' ').forEach(event => this.nodes[el].removeEventListener(event, handler, options));
    }
    );
};