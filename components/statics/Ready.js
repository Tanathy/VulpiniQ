// Name: Ready
// Method: Static
// Desc: Registers callbacks to be executed when the DOM is fully loaded.
// Type: Event Handling
// Example: Q.Ready(() => { console.log('DOM is ready'); });
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