// Name: trigger
// Method: Prototype
// Desc: Triggers a specific event on each node.
// Type: Event Handling
// Example: Q(selector).trigger("click");
// Variables: event, el, index
Q.Ext('trigger', function (event) {
	// ...existing code...
	return this.each(function(index, el) {
		el.dispatchEvent(new Event(event));
	});
});