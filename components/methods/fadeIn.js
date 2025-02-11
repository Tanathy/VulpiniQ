// Name: fadeIn
// Method: Prototype
// Desc: Fades in each node.
// Type: Display
// Example: Q(selector).fadeIn(duration, callback);
// Variables: duration, callback, elementStyle, nodeElements, elementIndex
Q.Ext('fadeIn', function(duration = 400, callback) {
    const nodeElements = this.nodes;
    this.each(function(elementIndex) {
      const element = nodeElements[elementIndex];
      const elementStyle = element.style;
      elementStyle.display = '';
      elementStyle.transition = `opacity ${duration}ms`;
      void element.offsetHeight;
      elementStyle.opacity = 1;
      setTimeout(function() {
        elementStyle.transition = '';
        if (callback) {
          callback();
        }
      }, duration);
    });
  });
  