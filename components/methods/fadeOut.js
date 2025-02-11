// Name: fadeOut
// Method: Prototype
// Desc: Fades out each node.
// Type: Display
// Example: Q(selector).fadeOut(duration, callback);
// Variables: duration, callback, elementStyle, nodeElements, elementIndex
Q.Ext('fadeOut', function(duration, callback) {
    const nodeElements = this.nodes;
    this.each(function(elementIndex) {
      const elementStyle = nodeElements[elementIndex].style;
      elementStyle.transition = `opacity ${duration}ms`;
      elementStyle.opacity = 0;
      setTimeout(function() {
        elementStyle.transition = '';
        elementStyle.display = 'none';
        if (callback) {
          callback();
        }
      }, duration);
    });
  });
  