// Name: Leaving
// Method: Static
// Desc: Registers callbacks to be executed when the window is about to be unloaded, providing a chance to run cleanup tasks or warn the user about unsaved changes. <br> This can be useful for saving state, logging actions, or preventing accidental navigation away from the page. <br> Multiple callbacks can be registered, and they will be executed in the order they were added whenever the beforeunload event is triggered.
// Type: Event Handling
// Example: Q.Leaving((event) => { console.log('Window is about to be unloaded'); }); // Logs a message when the window is about to unload <br> Q.Leaving((event) => { event.returnValue = 'Are you sure you want to leave?'; }); // Prompts the user with a confirmation message before leaving
// Variables: callbacks, event, callback
Q.Leaving=((c)=>{
    let ev;
    window.addEventListener("beforeunload",e=>{
      ev=e;while(c.length)c.shift()(e);c=0
    });
    return f=>c?c.push(f):f(ev)
  })([])
