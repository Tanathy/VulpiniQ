// Name: Ready
// Method: Static
// Desc: Registers callbacks to be executed once the DOM is fully loaded and parsed, ensuring your scripts can safely interact with the document's structure. <br> Ideal for initializing features, manipulating elements, or setting up event listeners without waiting for the entire page (images, styles) to load. <br> Multiple callbacks can be added, and they will be executed in sequence when the DOMContentLoaded event fires, or immediately if the DOM is already ready.
// Type: Event Handling
// Example: Q.Ready(() => { console.log('DOM is ready'); }); // Executes a callback when the DOM is fully loaded <br> Q.Ready(() => { document.body.style.backgroundColor = 'lightblue'; }); // Changes the background color once the DOM is ready
// Variables: callbacks, callback
Q.Ready = (function () {
    const callbacks = [];
    document.addEventListener('DOMContentLoaded', () => {
        callbacks.forEach(callback => callback());
    }, { once: true });

    return function (callback) {
        if (document.readyState === 'loading') {
            callbacks.push(callback);
        } else {
            callback();
        }
    };
})();
