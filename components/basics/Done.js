// Name: Done
// Method: Static
// Desc: Registers callbacks to be executed when the window has fully loaded.
// Type: Event Handling
// Example: Q.Done(() => { console.log('Window has fully loaded'); });
// Variables: callbacks, callback
Q.Done = (function () {
    const callbacks = [];
    window.addEventListener('load', () => {
        callbacks.forEach(callback => callback());
    });
    return function (callback) {
        callbacks.push(callback);
    };
})();