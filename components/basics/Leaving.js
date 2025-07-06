/**
 * @metadata
 * {
 *   "name": "Leaving",
 *   "method": "Q.Leaving(callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Static",
 *   "category": "Events",
 *   "desc": "Executes callbacks when the user is about to leave the page.",
 *   "longDesc": "This script provides a mechanism to queue and execute callback functions when the beforeunload event is triggered. It maintains a queue of functions that are executed in order when the user attempts to leave the page. The callbacks receive the beforeunload event as a parameter, allowing them to potentially prevent the page from closing or perform cleanup operations.",
 *   "dependencies": [],
 *   "variables": [
 *     "c",
 *     "ev"
 *   ],
 *   "examples": [
 *     "Q.Leaving((e) => console.log('User is leaving'));",
 *     "Q.Leaving(function(event) { return 'Are you sure you want to leave?'; });",
 *     "Q.Leaving((e) => { localStorage.setItem('lastVisit', Date.now()); });"
 *   ],
 *   "flaws": "",
 *   "optimizations": "Uses closure to maintain private callback queue and event reference, efficient array shifting",
 *   "performance": "Lightweight implementation with minimal overhead, callbacks receive event object for maximum flexibility"
 * }
 */
Q.Leaving=((c)=>{
    let ev;
    window.addEventListener("beforeunload",e=>{
      ev=e;while(c.length)c.shift()(e);c=0
    });
    return f=>c?c.push(f):f(ev)
  })([]);
