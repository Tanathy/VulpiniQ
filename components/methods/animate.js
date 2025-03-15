// Name: animate
// Method: Prototype
// Desc: Animates each node using specified CSS properties over a given duration, with an optional callback when complete.
// Long Desc: Animates each node using specified CSS properties over a given duration in milliseconds. You can animate multiple CSS properties, such as opacity, position, or color. The callback function will be called after the animation ends, allowing for further actions.
// Type: Animation
// Example: Q(selector).animate(500, { opacity: 0 }, () => { console.log('Fade out complete'); }); // Fades out over 500ms <br> Q(selector).animate(1000, { left: "100px", top: "50px" }); // Moves to new position in 1 second <br> Q(selector).animate(700, { opacity: 1, backgroundColor: "#ff0000" }, () => { alert('Animation finished!'); }); // Changes opacity and background color
// Variables: duration, properties, transitionProperties, prop, callback, element, el
// Dependencies: each
Q.Ext('animate', function (duration, properties, callback) {
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