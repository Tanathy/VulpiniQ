// Name: size
// Method: Prototype
// Desc: Returns the width and height of the first node.
// Type: Dimensions
// Example: Q(selector).size();
Q.Ext('size', function () {
	// ...existing code...
	return {
		width: this.nodes[0].offsetWidth,
		height: this.nodes[0].offsetHeight
	};
});