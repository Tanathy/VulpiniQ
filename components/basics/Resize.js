/**
 * @metadata
 * {
 *   "name": "Resize",
 *   "method": "Q.Resize(callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Static",
 *   "category": "Events",
 *   "desc": "Executes callbacks when the window is resized, passing current dimensions.",
 *   "longDesc": "This script provides a mechanism to register callback functions that are executed whenever the window is resized. Each callback receives the current window's innerWidth and innerHeight as parameters, making it easy to respond to viewport changes. All registered callbacks are executed synchronously when the resize event occurs.",
 *   "dependencies": [],
 *   "variables": [
 *     "c"
 *   ],
 *   "examples": [
 *     "Q.Resize((width, height) => console.log('Window size: ' + width + 'x' + height));",
 *     "Q.Resize(function(w, h) { if (w < 768) document.body.classList.add('mobile'); });",
 *     "Q.Resize((width, height) => { Q('#viewport-info').text(width + 'x' + height); });"
 *   ],
 *   "flaws": "",
 *   "optimizations": "Uses closure to maintain private callback array, efficient for loop for callback execution",
 *   "performance": "Lightweight implementation with minimal overhead, callbacks receive current dimensions directly from innerWidth/innerHeight"
 * }
 */
Q.Resize=((c)=>{
    addEventListener("resize",()=>{
      for(let i=0,l=c.length;i<l;) c[i++](innerWidth,innerHeight)
    });
    return f=>c.push(f)
  })([]);
