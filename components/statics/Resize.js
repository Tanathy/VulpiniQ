// Name: Resize
// Method: Static
// Desc: Registers callbacks to be executed on window resize, providing the new width and height.
// Type: Event Handling
// Example: Q.Resize((width, height) => { console.log(`Width: ${width}, Height: ${height}`); });
// Variables: callbacks, width, height, callback
Q.Resize = (function () {
    const callbacks = [];
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        callbacks.forEach(callback => callback(width, height));
    });
    return function (callback) {
        callbacks.push(callback);
    };
})();