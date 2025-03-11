// Name: fadeOut
// Method: Prototype
// Desc: Fades out each node.
// Type: Display
// Example: Q(selector).fadeOut(duration, callback);
// Variables: duration, callback, elementStyle, nodeElements, elementIndex
Q.Ext('fadeOut', function(duration, callback) {
    const nodeElements = this.nodes;
    this.each(index => {
      const elementStyle = nodeElements[index].style;
      elementStyle.transition = `opacity ${duration}ms`;
      elementStyle.opacity = 0;
      setTimeout(() => {
        elementStyle.transition = '';
        elementStyle.display = 'none';
        if (callback) callback();
      }, duration);
    });
});
