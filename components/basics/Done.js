// Name: Done
// Method: Static
// Desc: Registers one or more callback functions to be executed once the window has completely loaded, ensuring that all resources are available. <br> Useful for executing scripts that depend on the DOM, images, or other resources being fully loaded. <br> This function allows for multiple callbacks to be registered, which will all be executed in the order they were added when the load event occurs.
// Type: Event Handling
// Usage:
//   // Basic usage - single callback
//   Q.Done(() => {
//       console.log('Window has fully loaded');
//       document.body.style.opacity = '1';
//   });
//   
//   // Multiple callbacks - executed in order
//   Q.Done(() => {
//       // Initialize main application
//       initApp();
//   });
//   
//   Q.Done(() => {
//       // Load additional resources
//       loadResources();
//   });
//   
//   Q.Done(() => {
//       // Show UI elements
//       document.querySelector('#app').style.display = 'block';
//       document.querySelector('#loader').style.display = 'none';
//   });
// Variables:
Q.Done = ((c) => {
    window.addEventListener("load", () => { while (c.length) c.shift()(); c = 0 });
    return f => c ? c.push(f) : f()
})([])
