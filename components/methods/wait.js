// Name: wait
// Method: Prototype
// Desc: Returns a promise that resolves after a given time. Useful for delaying actions.
// Type: Utility
// Example: Q('.text').wait(1000).text('Hello, World!');
// Variables: ms
Q.Ext('wait', function(ms) {
	// ...existing code...
	return new Promise(resolve => setTimeout(() => resolve(this), ms));
});
