// Name: Resize
// Method: Static
// Desc: Registers callbacks to be executed whenever the window is resized, providing the updated width and height. <br> This is useful for dynamic layouts, responsive design adjustments, or recalculating dimensions based on the window size. <br> Each registered callback will receive the current window width and height, and multiple callbacks can be added to handle different aspects of resizing.
// Type: Event Handling
// Example: Q.Resize((width, height) => { console.log(`Width: ${width}, Height: ${height}`); }); // Logs the new dimensions every time the window is resized <br> Q.Resize((width, height) => { document.body.style.fontSize = `${width / 100}px`; }); // Adjusts font size based on the window's width
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
