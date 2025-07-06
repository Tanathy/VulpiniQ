/**
 * @metadata
 * {
 *   "name": "wait",
 *   "method": "wait(delay)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "async",
 *   "desc": "Returns a Promise that resolves after the specified delay in milliseconds, allowing for chained async operations.",
 *   "longDesc": "This method returns a Promise that resolves after the specified delay in milliseconds. It allows for chaining async operations and provides a way to introduce delays in method chains. The Promise resolves with the Q object itself, allowing for continued chaining of operations.",
 *   "dependencies": [],
 *   "variables": ["ms"],
 *   "examples": [
 *     "await Q('.element').wait(1000)",
 *     "Q('.item').show().wait(500).then(el => el.fadeOut())"
 *   ],
 *   "flaws": "Simple delay only, No cancellation support",
 *   "optimizations": "Add cancellation token support, Add frame-based waiting",
 *   "performance": "O(1) - uses setTimeout internally"
 * }
 */
Q.Method('wait', function(ms) {
	return new Promise(resolve => setTimeout(() => resolve(this), ms));
});
