/**
 * @metadata
 * {
 *   "name": "animate",
 *   "method": "animate(duration, properties, callback)",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Prototype",
 *   "category": "animation",
 *   "desc": "Animates CSS properties over a specified duration using CSS transitions. Supports callback function execution after animation completion.",
 *   "longDesc": "This method creates CSS transition animations on selected elements. It accepts a duration in milliseconds, an object containing CSS properties to animate, and an optional callback function to execute when the animation completes. The method uses CSS transitions for smooth performance and automatically cleans up transition properties after animation.",
 *   "dependencies": [],
 *   "variables": ["nodes", "element", "keys", "transitionProperties", "prop"],
 *   "examples": [
 *     "Q('.box').animate(1000, {opacity: 0.5, left: '100px'});",
 *     "Q('#item').animate(500, {width: '200px'}, function() { console.log('done'); });"
 *   ],
 *   "flaws": "Uses setTimeout instead of transitionend event, overwrites existing transition property",
 *   "optimizations": "Use transitionend event for callback, preserve existing transitions",
 *   "performance": "O(n*p) where n is number of elements and p is number of properties"
 * }
 */
Q.Method('animate', function (duration, properties, callback) {
  var nodes = this.nodes;
  for (var i = 0, len = nodes.length; i < len; i++) {
    var element = nodes[i],
        keys = Object.keys(properties),
        transitionProperties = '';
    for (var j = 0, klen = keys.length; j < klen; j++) {
      transitionProperties += keys[j] + ' ' + duration + 'ms' + (j < klen - 1 ? ', ' : '');
    }
    element.style.transition = transitionProperties;
    for (var j = 0; j < klen; j++) {
      var prop = keys[j];
      element.style[prop] = properties[prop];
    }
    if (typeof callback === 'function') {
      setTimeout((function(el){
          return function(){ callback.call(el); };
      })(element), duration);
    }
  }
  return this;
});
