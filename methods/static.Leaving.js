// Name: Leaving
// Method: Static
// Desc: Registers callbacks to be executed when the window is about to be unloaded.
// Type: Event Handling
// Example: Q.Leaving((event) => { console.log('Window is about to be unloaded'); });
Q.Leaving = (function () {
    const callbacks = [];
    window.addEventListener('beforeunload', (event) => {
        callbacks.forEach(callback => callback(event));
    });
    return function (callback) {
        callbacks.push(callback);
    };
})();