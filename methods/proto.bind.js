Q.prototype.bind = function (event, handler) {
    // Adds an event listener to each node with the ability to use event delegation.|Event Handling|Q(selector).bind("click", () => console.log("Clicked"));
    if (!this._eventDelegation) {
        this._eventDelegation = {};
    }

    if (!this._eventDelegation[event]) {
        document.addEventListener(event, (e) => {
            this.each(el => {
                if (this.nodes[el].contains(e.target)) {
                    handler.call(e.target, e);
                }
            });
        });
        this._eventDelegation[event] = true;
    }
    return this;
};