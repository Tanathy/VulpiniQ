// Name: Leaving
// Method: Static
// Desc: Registers callbacks to be executed when the window is about to be unloaded, providing a chance to run cleanup tasks or warn the user about unsaved changes. <br> This can be useful for saving state, logging actions, or preventing accidental navigation away from the page. <br> Multiple callbacks can be registered, and they will be executed in the order they were added whenever the beforeunload event is triggered.
// Type: Event Handling
// Usage:
//   // Warn about unsaved changes
//   Q.Leaving((event) => {
//       if (hasUnsavedChanges()) {
//           event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
//       }
//   });
//   
//   // Save application state
//   Q.Leaving((event) => {
//       localStorage.setItem('appState', JSON.stringify(getCurrentState()));
//       sessionStorage.setItem('lastVisited', new Date().toISOString());
//   });
//   
//   // Cleanup resources
//   Q.Leaving((event) => {
//       disconnectWebSockets();
//       cancelPendingRequests();
//       releaseResources();
//   });
// Variables: callbacks, event, callback
Q.Leaving=((c)=>{
    let ev;
    window.addEventListener("beforeunload",e=>{
      ev=e;while(c.length)c.shift()(e);c=0
    });
    return f=>c?c.push(f):f(ev)
  })([])
