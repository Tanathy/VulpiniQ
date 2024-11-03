// Name: Done
// Method: Static
// Desc: Registers one or more callback functions to be executed once the window has completely loaded, ensuring that all resources are available. <br> Useful for executing scripts that depend on the DOM, images, or other resources being fully loaded. <br> This function allows for multiple callbacks to be registered, which will all be executed in the order they were added when the load event occurs.
// Type: Event Handling
// Example: Q.Done(() => { console.log('Window has fully loaded'); }); // Registers a callback to log a message once the window is loaded <br> Q.Done(() => { alert('Page is ready!'); }); // Adds another callback to show an alert when the window has fully loaded
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
