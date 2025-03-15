Q.Ext('size', function () {
	// ...existing code...
    const node = this.nodes[0];
	return {
		width: node.offsetWidth,
		height: node.offsetHeight
	};
});