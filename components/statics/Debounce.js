// Name: Debounce
// Method: Utility
// Desc: Debounces a function to ensure it is only called after a specified delay since the last invocation, effectively preventing multiple calls in rapid succession. <br> This technique is particularly useful in scenarios like resizing windows, scrolling, or typing events, where multiple triggers can lead to performance issues or unintended behavior. <br> By controlling the rate at which a function can fire, developers can optimize performance and enhance user experience.
// Type: Event Handling
// Example: Q.Debounce('myFunction', 500, myFunction); // Calls myFunction after 500ms of inactivity <br> Q.Debounce('resizeEvent', 300, handleResize); // Debounces resize handling function
// Variables: id, time, callback
Q.Debounce = function (id, time, callback) {
    let glob = Q.getGLOBAL('Debounce');
    if (glob && glob[id]) {
        clearTimeout(glob[id]);
    }
    Q.setGLOBAL({ Debounce: { ...glob, [id]: setTimeout(callback, time) } });
};
