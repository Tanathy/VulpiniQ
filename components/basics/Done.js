/**
 * @metadata
 * {
 *   "name": "Done",
 *   "method": "Q.Done(callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Static",
 *   "category": "Events",
 *   "desc": "Executes callbacks when the window load event is triggered.",
 *   "longDesc": "This script provides a mechanism to queue and execute callback functions when the window load event is triggered. It maintains a queue of functions that are executed in order when the page is fully loaded. If called after the load event has already fired, the callback is executed immediately.",
 *   "dependencies": [],
 *   "variables": [
 *     "c"
 *   ],
 *   "examples": [
 *     "Q.Done(() => console.log('Page loaded'));",
 *     "Q.Done(function() { document.body.style.backgroundColor = 'lightblue'; });",
 *     "Q.Done(() => { Q('#myElement').addClass('loaded'); });"
 *   ],
 *   "flaws": "",
 *   "optimizations": "Uses closure to maintain private callback queue, efficient array shifting for execution",
 *   "performance": "Lightweight implementation with minimal overhead, callbacks are executed synchronously on load event"
 * }
 */
Q.Done=((c)=>{
    window.addEventListener("load",()=>{while(c.length)c.shift()();c=0});
    return f=>c?c.push(f):f()
})([]);
