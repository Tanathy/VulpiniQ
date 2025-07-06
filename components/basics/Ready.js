/**
 * @metadata
 * {
 *   "name": "Ready",
 *   "method": "Q.Ready(callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Static",
 *   "category": "Events",
 *   "desc": "Executes callbacks when the DOM is ready or immediately if already loaded.",
 *   "longDesc": "This script provides a mechanism to queue and execute callback functions when the DOM is fully loaded and parsed. It checks the document's readyState and either queues callbacks for the DOMContentLoaded event or executes them immediately if the DOM is already ready. This is similar to jQuery's $(document).ready() function.",
 *   "dependencies": [],
 *   "variables": [
 *     "c"
 *   ],
 *   "examples": [
 *     "Q.Ready(() => console.log('DOM is ready'));",
 *     "Q.Ready(function() { Q('#myElement').addClass('ready'); });",
 *     "Q.Ready(() => { document.body.style.display = 'block'; });"
 *   ],
 *   "flaws": "",
 *   "optimizations": "Uses closure to maintain private callback queue, checks readyState to avoid unnecessary event listeners",
 *   "performance": "Lightweight implementation with immediate execution if DOM is already ready, uses once option for event listener"
 * }
 */
Q.Ready=((c)=>{
    document.readyState==='loading'?document.addEventListener("DOMContentLoaded",()=>{while(c.length)c.shift()();c=0},{once:1}):c=0;
    return f=>c?c.push(f):f();
  })([]);
