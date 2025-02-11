// Name: fadeToggle
// Method: Prototype
// Desc: Toggles the fade state of each node.
// Type: Display
// Example: Q(selector).fadeToggle(duration, callback);
// Variables: duration, callback, nodeElements, computedStyle, elementIndex
Q.Ext('fadeToggle', function(duration, callback) {
    const nodeElements = this.nodes;
    this.each(function(elementIndex) {
      const computedStyle = window.getComputedStyle(nodeElements[elementIndex]);
      if (computedStyle.opacity === '0') {
        this.fadeIn(duration, callback);
      } else {
        this.fadeOut(duration, callback);
      }
    });
  });
  