// Name: fadeTo
// Method: Prototype
// Desc: Fades each node to a specific opacity.
// Type: Display
// Example: Q(selector).fadeTo(opacity, duration, callback);
// Variables: opacity, duration, callback, elementStyle, nodeElements, elementIndex
Q.Ext('fadeTo', function(opacity, duration, callback) {
    const nodeElements = this.nodes;
    this.each(function(elementIndex) {
      const element = nodeElements[elementIndex];
      const elementStyle = element.style;
      elementStyle.transition = `opacity ${duration}ms`;
      void element.offsetHeight;
      elementStyle.opacity = opacity;
      setTimeout(function() {
        elementStyle.transition = '';
        if (callback) {
          callback();
        }
      }, duration);
    });
  });
  