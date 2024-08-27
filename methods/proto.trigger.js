Q.prototype.trigger = function (event) {
    // Triggers a specific event on each node.|Event Handling|Q(selector).trigger("click");
    return this.each(function (index, el) {
        el.dispatchEvent(new Event(event));
    });
};