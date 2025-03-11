// Name: Ready
// Method: Static
// Desc: Registers callbacks to be executed once the DOM is fully loaded and parsed, ensuring your scripts can safely interact with the document's structure. <br> Ideal for initializing features, manipulating elements, or setting up event listeners without waiting for the entire page (images, styles) to load. <br> Multiple callbacks can be added, and they will be executed in sequence when the DOMContentLoaded event fires, or immediately if the DOM is already ready.
// Type: Event Handling
// Usage:
//   // Basic initialization
//   Q.Ready(() => {
//       const app = document.querySelector('#app');
//       app.classList.remove('loading');
//   });
//   
//   // Set up event listeners
//   Q.Ready(() => {
//       document.querySelectorAll('.nav-link').forEach(link => {
//           link.addEventListener('click', handleNavigation);
//       });
//   });
//   
//   // Initialize third-party libraries
//   Q.Ready(() => {
//       initializeLibrary();
//       setupComponents();
//   });
// Variables: callbacks, callback
Q.Ready=((c)=>{
    document.readyState==='loading'?document.addEventListener("DOMContentLoaded",()=>{while(c.length)c.shift()();c=0},{once:1}):c=0;
    return f=>c?c.push(f):f();
  })([])
