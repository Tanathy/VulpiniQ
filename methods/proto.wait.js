// Name: Wait
// Method: Prototype
// Desc: Returns a promise that resolves after a given time. Useful for delaying actions.
// Type: Utility
// Example: Q('.text').wait(1000).text('Hello, World!');
Q.prototype.wait = function (ms) {
    // Store the current instance of Q
    const qInstance = this;

    // Return a new promise that resolves after the wait period
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(qInstance); // Resolve with the current instance to keep chaining
        }, ms);
    });
};