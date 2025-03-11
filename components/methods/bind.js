// Name: bind
// Method: Prototype
// Desc: Adds an event listener to each node, allowing for event delegation to improve performance.
// Long Desc: Adds an event listener to each node. Supports event delegation, meaning events can be captured on parent elements and trigger handlers for child nodes. This is particularly useful for dynamically created elements. 
// Type: Event Handling
// Example: Q(selector).bind("click", () => console.log("Clicked")); // Logs "Clicked" when any matching node is clicked <br> Q(".btn").bind("mouseover", (e) => { console.log(`Hovered over: ${e.target.tagName}`); }); // Logs the tag name of the hovered element <br> Q("ul").bind("click", (e) => { console.log(`Item clicked: ${e.target.textContent}`); }); // Logs the text of the clicked list item
// Variables: event, handler, el, _eventDelegation
Q.Ext('bind', function (event, handler) {
    if (!this._eventDelegation) {
        this._eventDelegation = {};
    }

    if (!this._eventDelegation[event]) {
        document.addEventListener(event, (e) => {
            const nodes = this.nodes;
            for (const node of nodes) {
                if (node.contains(e.target)) {
                    handler.call(e.target, e);
                }
            }
        });
        this._eventDelegation[event] = true;
    }
    return this;
});
